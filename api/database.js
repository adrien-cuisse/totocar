
// Database instance

const config = require('./config');

const database = require('mongoose');


database.connect('mongodb://' + config.api.url + ':' + config.database.port + '/' + config.database.name, {
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});


module.exports = database;
