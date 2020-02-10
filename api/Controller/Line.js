
const City = require('./../Model/City')
const Line = require('./../Model/Line');

const extractValidationErrors = require('./utils/errors');
const combinations = require('./utils/maths').combinations;


/**
 * Returns the list of lines passing first in [fromCity] and then in [toCity]
 * 
 * @param {string} fromCity - the name of the first city to cross
 * @param {string} toCity - the name of the second city to cross
 * 
 * @return {array} - the list of lines crossing cities in this order, will be empty if error occured
 */
const fromCityToCity = (fromCity, toCity) => {
	
	return Line
		.find()
		.populate('cities')
		.then(lines => lines.filter(line => {
			const fromIndex = line.cities.findIndex(city => city.name === fromCity);
			const toIndex = line.cities.findIndex(city => city.name === toCity) ;
			
			return (fromIndex !== -1) && (toIndex !== -1) && (fromIndex < toIndex);
		}))
		.catch(error => {
			console.log('LineController::fromCityToCity error:', error);
			return [];
		});
};

/**
 * Finds paths the user can take from his budget and time
 * As for now, doesn't handle multi-line travels
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 */
const path = (request, response) => {

	fromCityToCity(request.body.from, request.body.to)
		.then(lines => {
			return lines.map(line => {
				
				// These might change in the future
				const timePerExtraCity = 30;
				const economyPerExtraCity = 2;
				const travelCost = line.price;
				const travelDuration = line.duration;

				const departure = line.cities.find(city => city.name === request.body.from);
				const arrival = line.cities.find(city => city.name === request.body.to);
				
				// Longest path possible on this line
				const worstPath = line.cities.slice(
					line.cities.findIndex(city => city === departure),
					line.cities.findIndex(city => city === arrival) + 1
				);

				const optionalCities = worstPath.slice(1, worstPath.length - 1);
				
				let extraCitiesMin; // minimum number of cities to add for user to have the budget
				let extraCitiesMax; // maximum number of cities to add for user to have enough time

				if (request.body.time >= travelDuration) {
					if (request.body.budget >= travelCost) { 
						extraCitiesMin = extraCitiesMax = 0;
					} else { // enough time but not enough budget, can add a few cities to cut the price, up to optionalCities.length
						let overBudget = travelCost - request.body.budget;
						extraCitiesMin = Math.floor(overBudget / economyPerExtraCity);

						// even after adding every optional city, user can't affort this line
						if (extraCitiesMin > optionalCities.length) {
							return;
						}

						let overTime = request.body.time - travelDuration;
						extraCitiesMax = Math.floor(overTime / timePerExtraCity);
						extraCitiesMax = Math.min(optionalCities.length, extraCitiesMax); // can't add more cities than there are on the line

						// if user still can't afford this line after cutting the price to its maximum
						if (extraCitiesMax * economyPerExtraCity + request.body.budget < travelCost) {
							return;
						}
					}
				} else { // not enough time, even with fastest route, can't take this line 
					return;
				}
					
				// Generating routes with departure and arrival
				const routes = combinations(
					optionalCities.map(city => city.name),
					extraCitiesMin, 
					extraCitiesMax,
				).map(combination => [
					departure.name,
					...combination,
					arrival.name,
				]);

				return {
					line: line.name,
					path: line.cities.map(city => city.name),
					options: routes,
				};
			})
		})
		.then(routes => {
			response.json({
				success: true,
				routes: routes,
			});
		})
		.catch(error => response.json({
			success: false,
			error: error,
		}));
};


/**
 * Paginates the list of lines
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entities' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const listLines = (request, response) => {
	let page = parseInt(request.params.page) || 1;

	// The number of results per page
	const limit = 10;

	Line
		.find({})
		.populate('cities')
		.then(lines => {
			const pages = Math.floor(lines.length / limit) + 1;
			page = Math.min(page, pages);
			page = Math.max(page, 1);
			
			lines = lines.slice((page - 1) * limit, page * limit);
			
			response.json({
				pages: pages,
				entities: lines,
			});
		})
		.catch(error => response.json({
			success: false,
			error: error,
		}));
};


/**
 * Sends the data format to create a new line
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - json containing the format in a 'format' property
 */
const createLineFormat = (request, response) => {
	City
		.find({})
		.then(cities => {
			response.json({
				success: true,
				format: {
					name: {
						type: 'String'
					},
					cities: {
						type: 'ManyChoices',
						options: cities.sort((a,b) => a.name > b.name),
					},
					duration: { 
						type: 'Number',
					},
					price: {
						type: 'Number',
					},
				},
			});
		})
		.catch(error => {
			console.log('LineController::createLineFormat error:', error);
			response.json({
				success: false,
			});
		})
};


/**
 * Stores a new line in the database
 * For appropriate request content, @see createLineFormat
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entity' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const createLine = (request, response) => {

	City
		.find({ _id: { $in: request.body.cities } }) // only valid cities
		.then(cities => {
			// Mongoose loads ID-ordered cities, but we need to keep the original one
			const orderedCities = request.body.cities.map(cityId => cities.find(city => city._id === cityId));

			Line
				.create({
					name: request.body.name,
					cities: orderedCities.map(city => city._id),
					duration: request.body.duration,
					price: request.body.price, 
				})
				.then(line => {
					response.json({
						success: true,
						entity: line,
					});
				})
				.catch(errors => {
					response.json({
						success: false,
						errors: extractValidationErrors(errors),
					})
				});
		})
		.catch(() => {
			response.json({
				success: false,
				errors: {
					cities: 'Line must at meast link 2 cities',
				},
			})
		});
};


/**
 * Reads a line from the database
 * Requires the request to contain an 'id' field
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entity' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const readLine = (request, response) => {
	Line
		.findById(request.params.id)
		.populate('cities')
		.then(line => {
			response.json({
				success: true,
				entity: line,
			});
		})
		.catch(error => response.json({
			success: false,
			error: error,
		}));
};


/**
 * Sends the data format to update an existing line
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - json containing the format in a 'format' property
 */
const updateLineFormat = (request, response) => {
	Line
		.findById(request.params.id)
		.populate('cities')
		.lean()
		.then(line => {	
			if (null === line) {
				response.json({
					success: false,
					error: 'Line not found',
				});
			} else {
				line.cities = line.cities.map(city => city._id); // we only need ids to know which cities are selected
			
				City
					.find({})
					.then(allCities => {
						response.json({
							success: true,
							format: {
								name: {
									type: 'String'
								},
								cities: {
									type: 'ManyChoices',
									options: allCities.sort((a,b) => a.name > b.name),
								},
								duration: { 
									type: 'Number',
								},
								price: {
									type: 'Number',
								},
							},
							entity: line,
						});
					})
			}
		})
		.catch(error => response.json({
			success: false,
			error: error,
		}));
};


/**
 * Updates an existing line from the database
 * For appropriate request content, @see updateLineFormat
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 * 
 * @return {ServerResponse} - if request succeeded, response will contain a 'success' property set to true, and result will be stored
 * 		in 'entity' property,
 * 		if request failed, response will contain a 'success' property set to false, and raised errors will be stored in 'errors' property
 */
const updateLine = (request, response) => {
	const options = { 
		runValidators: true,
		context: 'query', 
		new: true // send updated version to the callback 	
	};

	Line
		.findByIdAndUpdate(request.params.id, request.body, options)
		.then(line => {
			if (null === line) {
				response.json({
					success: false,
					errors: 'Line not found',
				});
			} else {
				response.json({
					success: true,
					entity: line,
				});
			}
		})
		.catch(errors => response.json({
			success: false,
			errors: extractValidationErrors(errors),
		}));
};


/**
 * Deletes an existing Line from the database
 * Requires the request to contain an 'id' field
 * 
 * @param {IncomingMessage} request - the HTTP request, @see https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp 
 * @param {ServerResponse} response - the response handler, @see https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
 */
const deleteLine = (request, response) => {
	Line
		.findByIdAndDelete(request.params.id)
		.then(line => {
			if (null === line) {
				response.json({
					success: false,
					error: 'Line not found',
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

	path: path,

	list: listLines,

	createFormat: createLineFormat,
	create: createLine,

	read: readLine,

	updateFormat: updateLineFormat,
	update: updateLine,

	delete: deleteLine,
};
