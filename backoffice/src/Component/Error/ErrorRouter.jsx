
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from './NotFound';


const ErrorRouter = ({ match }) => (

	<Switch>
		<Route path={ `${match.path}/404` } component={ NotFound } />

		{/* Put other errors to match before the wildcard */}

		<Route path='/:wildcard' component={ NotFound } />
	</Switch>
);


export default ErrorRouter;
