
import React, { useMemo } from 'react';

import Form from '../Form/Form';

import config from './../../config';


/**
 * Displays the form the update the targeted entity
 * URL requirements:
 * 		- entity slug: the kind of entity to update
 * 		- id slug: the id of the entity to update
 * 
 * @param {object} match - the matched url, sent from the main router (name cannot be changed)
 * 
 * @return {Form} - @see {Form}
 */
const UpdateEntity = ({ match }) => {
	
	// Extracting url params to make it easier to read
	const entity = match.params.entity;
	const id = match.params.id;
	
	// Building the API url, and updating if depencies changed
	const baseApiUrl = config.api.url + ':' + config.api.port;
	const targetApiUrl = useMemo(
		() => [baseApiUrl, entity, id, 'update'].join('/'),
		[baseApiUrl, entity, id]
	);


	return (
		<Form 
			verb='patch' 
			url={ targetApiUrl }
		/>
	);
}


export default UpdateEntity;
