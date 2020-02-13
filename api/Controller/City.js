
const City = require('./../Model/City');

const extractValidationErrors = require('./utils/errors');


/**
 * Paginates the list of cities
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entities' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const listCities = (request, response) => {
	let page = parseInt(request.params.page) || 1;

	// The number of results per page
	const limit = 5;

	City
		.find({})
		.then(cities => {
			const pages = Math.ceil(cities.length / limit);
			page = Math.min(page, pages);
			page = Math.max(page, 1);

			response.json({
				page: page,
				pages: pages,
				previous: page > 1 ? page - 1 : undefined,
				next: page < pages ? page + 1 : undefined,
				entities: cities.slice((page - 1) * limit, page * limit)
			});
		})
		.catch(errors => response.json({
			success: false,
			errors: errors,
		}));
};


/**
 * Sends the data format to create a new city
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - json containing the format in a 'format' property
 */
const createCityFormat = (request, response) => response.json({
	success: true,
	format: {
		name: {
			type: 'String'
		},
	},
});


/**
 * Stores a new city in the database
 * For appropriate request content, @see createCityFormat
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entity' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const createCity = (request, response) => {
	City
		.create({ name: request.body.name })
		.then(city => response.json({
			success: true,
			entity: city,
		}))
		.catch(errors => {
			response.json({
				success: false,
				errors: extractValidationErrors(errors),
			})
		});
};


/**
 * Reads a city from the database
 * Requires the request to contain an 'id' field
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entity' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const readCity = (request, response) => {
	City
		.findById(request.params.id)
		.then(city => {
			if (null === city) {
				response.json({
					success: false,
					errors: 'City not found',
				});
			} else {
				response.json({
					success: true,
					entity: city,
				});
			}
		})
		.catch(error => response.json({
			success: false,
			error: error,
		}));
};


/**
 * Sends the data format to update an existing city
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - json containing the format in a 'format' property
 */
const updateCityFormat = (request, response) => {
	City
		.findById(request.params.id)
		.then(city => {
			if (null === city) {
				response.json({
					success: false,
					error: 'City not found',
				});
			} else {
				response.json({
					success: true, 
					format: {
						name: {
							type: 'String',
						},
					},
					entity: city,
				});
			}
		})
		.catch(error => response.json({
			success: false,
			errors: error,
		}));
};


/**
 * Updates an existing city from the database
 * For appropriate request content, @see updateCityFormat
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entity' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const updateCity = (request, response) => {
	const options = { 
		runValidators: true,
		context: 'query', 
		new: true // send updated version to the callback 	
	};

	City
		.findByIdAndUpdate(request.params.id, request.body, options)
		.then(city => {
			if (null === city) {
				response.json({
					success: false,
					error: 'City not found',
				});
			} else {
				response.json({
					success: true,
					entity: city,
				});
			}
		})
		.catch(errors => response.json({
			success: false,
			errors: extractValidationErrors(errors),
		}));
};


/**
 * Deletes an existing city from the database
 * Requires the request to contain an 'id' field
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entity' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const deleteCity = (request, response) => {
	City
		.findByIdAndDelete(request.params.id)
		.then(city => {
			if (null === city) {
				response.json({
					success: false,
					error: 'City not found',
				});
			} else {
				response.json({
					success: true,
				});	
			}
		})
		.catch(error => response.json({
			success: false,
			error: error
		}));
};


module.exports = {
	list: listCities,

	createFormat: createCityFormat,
	create: createCity,

	read: readCity,

	updateFormat: updateCityFormat,
	update: updateCity,

	delete: deleteCity,
};
