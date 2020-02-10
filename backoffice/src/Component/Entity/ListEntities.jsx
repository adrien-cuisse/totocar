

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// API request handler (polyfill)
import axios from 'axios';

import config from './../../config';

import Pagination from './../common/Pagination';

/**
 * Displays a list of entities
 * 
 * URL requirements:
 * 		- entity slug: the kind of entity to display
 *   
 * @param {object} match - the matched url, sent from the <Route> Component by setting its 'component' prop
 */
const ListEntities = ({ match }) => {

	// Properties of the entities to display (their format)
	const [format, setFormat] = useState([]);

	// The paginated list of entities to display
	const [entities, setEntities] = useState([]);

	const [pagination, setPagination] = useState({});

	// Extracting url params to make it easier to read
	const entityName = match.params.entity;

	// Building the API url, and updating if depencies changed
	const baseApiUrl = config.api.url + ':' + config.api.port;
	const targetApiUrl = useMemo(
		() => [baseApiUrl, entityName, match.params.page ? 'page/' + match.params.page : undefined].join('/'),
		[baseApiUrl, entityName, match.params.page]
	);

	
	// Reload if entity changed
	useEffect(() => {	
		axios
			.get(targetApiUrl)
			.then(response => {
				if (0 !== response.data.entities.length) {
					setFormat(Object.keys(response.data.entities[0]).sort());
				}
				if (0 !== response.data.entities.length) {
					setEntities(response.data.entities);	
				}

				setPagination({
					current: response.data.page,
					count: response.data.pages, 
				});
			})
			.catch(error => {
				console.log('Axios error: ', error)
			});
	}, [targetApiUrl]);

	const renderProperty = property => {
		if (Array.isArray(property)) { // extract literals from the set
			return property.map(nestedProperty => renderProperty(nestedProperty)).join(', ');
		} else if (typeof property === 'object') { // nested entity, display its id
			return property._id;
		} else {
			return property; // literal value
		}
	};

	const renderEntity = entity => (
		format.map((propertyName, propertyIndex) => (
			<td key={ propertyIndex }>
				{ renderProperty(entity[propertyName]) }
			</td>
		))
	);


	return (
		<>
		<div className='container'>
			<table className='table table-hover'>
				
				<thead>
					<tr>
						{
							format.map((field, fieldIndex) => (
								<th scope='col' key={ fieldIndex }>
									{ field }
								</th>
							))
						}
						<th>Actions</th>
					</tr>
				</thead>

				<tbody>
					{
						entities.map((entity, entityIndex ) => (	
							<tr key={ entityIndex }>
								{
									renderEntity(entity)
								}
								<td className='d-flex justify-content-between'>
									<Link className='btn btn-info' to={ `${match.url}/`.replace(/\/page\/\d/, '') + entity._id }>
										View
									</Link>
									<Link className='btn btn-warning' to={ `${match.url}/`.replace(/\/page\/\d/, '') + entity._id + '/update' }>
										Update
									</Link>
									<Link className='btn btn-danger' to={ `${match.url}/`.replace(/\/page\/\d/, '') + entity._id + '/delete' }>
										Delete
									</Link>
								</td>
							</tr>
						))
					}
				</tbody>

			</table>

			<Link className={ 'btn btn-success btn-block' } to={ `${match.url}/new`.replace(/\/page\/\d/, '') } /*{ `${match.url}`.replace(/\/page\/\d/ + '/new', '') }*/>
				Create new { entityName }
			</Link>

			
		</div>
		<Pagination current={ pagination.current } count={ pagination.count } url={ match.url.replace(/\/page\/\d/, '') } />
		</>
	);
};


export default ListEntities;
