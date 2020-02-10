
// Server bootstrap with CORS enabled
const express = require('express');
const server = express();
server.use(require('cors')({ 
	origin: '*',
}));
server.use(express.json()); // json POST handler


// Importing the settings of the API
const config = require('./config');
const backoffice = 'http://' + config.backoffice.host + ':' + config.backoffice.port;


const publicRouter = require('express').Router();
publicRouter.post('/my-travel', require('./Controller/Line').path);
server.use('/api', publicRouter);


// Plugging CRUD sub-routers to global one, restricting them to back-office access
['city', 'line'].map(resource => {
	let subRouter = require('express').Router();
	let controller = require('./Controller/' + resource.slice(0, 1).toUpperCase() + resource.slice(1));

	/**
	 * Middleware, denies access to all, but to the back-office
	 * 
	 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
	 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
	 * @param {function} next - the next function to execute if condition verifies
	 */
	const grantCrudAccess = (request, response, next) => {
		if (request.headers.origin === backoffice) {
			next();
		} else {
			console.log('Denied access to', request.headers.origin);
			response.status(404).send();
		}
	};

	subRouter.get('/', grantCrudAccess, controller.list);
	subRouter.get('/page/:page', grantCrudAccess, controller.list);
	subRouter.get('/new', grantCrudAccess, controller.createFormat);
	subRouter.put('/new', grantCrudAccess, controller.create);
	subRouter.get('/:id', grantCrudAccess, controller.read);
	subRouter.get('/:id/update', grantCrudAccess, controller.updateFormat);
	subRouter.patch('/:id/update', grantCrudAccess, controller.update);
	subRouter.delete('/:id', grantCrudAccess, controller.delete);

	server.use('/' + resource, subRouter);
});

// Launch
server.listen(config.api.port, config.api.url);
console.log('Server listening on port ' + config.api.port);
