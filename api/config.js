
/**
 * Config centralized in this file for easier maintenance
 */

const database = {
	name: 'autocar',
	port: 27042, // The port mongod service is running on
};

const api = {
	url: 'localhost',
	port: 8000, // The port you will use to connect to the API
};

const backoffice = {
	host: 'localhost',
	port: 3000,
};

module.exports = {
	database: database,
	api: api,
	backoffice: backoffice,
};
