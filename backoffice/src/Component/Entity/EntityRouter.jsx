
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ListEntities from './ListEntities';
import CreateEntity from './CreateEntity';
import ReadEntity from './ReadEntity';
import UpdateEntity from './UpdateEntity';
import DeleteEntity from './DeleteEntity';

import ErrorRouter from './../Error/ErrorRouter';

/**
 * Router for entities, chooses the appropriate page to display, based on the react URL
 * For targeted API url, see concerned entity components
 * 
 * URL requirements:
 * 		- entity slug: the entity to find a route for
 * 
 * @param {object} match - the matched url, sent from the <Route> Component by setting its 'component' prop
 */
const EntityRouter = ({ match }) => {
	
	// White list slugs, to prevent a 404 from the api 
	const slugs = ['city', 'line'];
	if (! slugs.includes(match.params.entity)) {
		return <Route component={ ErrorRouter } />
	}
	

	return(
		<Switch>
			<Route exact path={ `${match.path}/new` } component={ CreateEntity } />
			<Route exact path={ `${match.path}/:id` } component={ ReadEntity } />
			<Route exact path={ `${match.path}/:id/update` } component={ UpdateEntity } />
			<Route exact path={ `${match.path}/:id/delete` } component={ DeleteEntity } />
			<Route exact path={ `${match.path}` } component={ ListEntities } />	
			<Route exact path={ `${match.path}/page/:page` } component={ ListEntities } />

			{/* Put other routes here, before the wildcard */}

			<Route component={ ErrorRouter} />
		</Switch>
	);
};


export default EntityRouter;
