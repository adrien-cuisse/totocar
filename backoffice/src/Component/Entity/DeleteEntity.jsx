
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

// API request handler (polyfill)
import axios from 'axios';

import config from './../../config';


/**
 * API call to delete the targeted entity
 * 
 * URL requirements:
 * 		- entity slug: the kind of entity to delete
 * 		- id slug: the id of the entity to delete
 *
 * @param {object} match - the matched url, sent from the <Route> Component by setting its 'component' prop
 */
const DeleteEntity = ({ match }) => {

	// Extracting url params to make it easier to read
	const entity = match.params.entity;
	const id = match.params.id;

	// Building the API url, and updating if depencies changed
	const baseApiUrl = config.api.url + ':' + config.api.port;
	const targetApiUrl = useMemo(
		() => [baseApiUrl, entity, id].join('/'),
		[baseApiUrl, entity, id]
	);
	
	const navigation = useHistory();

	axios
		.delete(targetApiUrl)
		.then(response => {
			if (response.data.success) {
				navigation.goBack();
			} else {
				console.log('Delete error:', response.data.error);
			}
		})
		.catch(error => console.log('Axios error: ', error));

	
	return <></>;
};


export default DeleteEntity;
