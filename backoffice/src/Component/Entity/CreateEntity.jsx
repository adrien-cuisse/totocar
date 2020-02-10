
import React, { useMemo } from 'react';

import Form from '../Form/Form';

import config from './../../config';


/**
 * The page to create a new entity
 * 
 * URL requirements:
 * 		- entity slug: the kind of entity to create
 * 
 * @param {object} match - the matched url, sent from the <Route> Component by setting its 'component' prop
 * 
 * @return {Form} - @see {Form}  
 */
const CreateEntity = ({ match }) => {
	
	// Extracting url params to make it easier to read
	const entity = match.params.entity;

	// Building the API url, and updating if depencies changed
	const baseApiUrl = config.api.url + ':' + config.api.port;
	const targetApiUrl = useMemo(
		() => [baseApiUrl, entity, 'new'].join('/'),
		[baseApiUrl, entity]
	);


	return (
		<Form 
			verb='put' 
			url={ targetApiUrl }
		/>
	);
}


export default CreateEntity;
