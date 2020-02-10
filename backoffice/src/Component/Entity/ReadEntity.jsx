
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// API request handler (polyfill)
import axios from 'axios';

import config from './../../config';


/**
 * Displays the targeted entity
 * URL requirements:
 * 		- entity slug: the kind of entity to read
 * 		- id slug: the id of the entity to read
 * 
 * @param {object} match - the matched url, sent from the main router (name cannot be changed)
 */
const ReadEntity = ({ match }) => {

	// Extracting url params to make it easier to read
	const entity = match.params.entity;
	const id = match.params.id;

	// Building the API url, and updating if depencies changed
	const baseApiUrl = config.api.url + ':' + config.api.port;
	const targetApiUrl = [baseApiUrl, entity, id].join('/');

	// Attributes and values of the targeted entity
	const [properties, setProperties] = useState({});

	const navigation = useHistory();
	
	// Reload if targeted entity changed
	useEffect(() => { 
		axios
			.get(targetApiUrl)
			.then(response => setProperties(response.data.entity))
			.catch(error => console.log('Axios error: ', error));
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


	return (
		<div className='container'>
			<table className='table table-hover'>
				
				<thead>
					<tr>
						{
							// Columns name from properties of the entity
							Object.keys(properties).sort().map((property, index) => (
								<th scope='col' key={ index }>
									{ property[0].toUpperCase() + property.substring(1) }
								</th>
							))
						}
					</tr>
				</thead>

				<tbody>
					<tr>
						{
							// Columns content
							Object.keys(properties).sort().map((propertyName, index) => {
								return (
									<td key={ index }>
										{ renderProperty(properties[propertyName]) }
									</td>
								);
							})
						}
					</tr>
				</tbody>

			</table>

			<button className='btn btn-info btn-block' onClick={() => navigation.goBack() }>
				Go back
			</button>
		</div>
	);
};


export default ReadEntity;
