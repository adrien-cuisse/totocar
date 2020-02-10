
const mongoose = require('./../database');

/**
 * A bus line, made of its name and the list of cities it stops in
 */
const lineSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Name is mandatory'],
		unique: [true, 'This line already exists'],
		validate: name => {
			if (! name.trim().length) {
				throw new Error('Name is mandatory');
			}
			return true;
		}
	},
	cities: {
		type: [{ // array of city ids
			type: Number,
			ref: 'City',
		}], 
		validate: cities => {
			if (cities.length < 2) {
				throw new Error('Line must at meast link 2 cities');
			}
			const uniques = [... new Set(cities)];
			if (uniques.length !== cities.length) {
				throw new Error('Line may not stop several in the same town');
			}
			return true;
		},
	},
	duration: {
		type: Number,
		required: [true, 'Please specify the travel duration '],
		validate: duration => {
			if (duration <= 0) {
				throw new Error('Travel duration must be greated than 0');
			}
			return true;
		},
	},
	price: {
		type: Number,
		required: [true, 'Price is mandatory'],
		validate: price => {
			if (price <= 0) {
				throw new Error('Price must be greater than 0');
			}
			return true;
		},
	}
}, { versionKey: false });


// Auto-validate unique fields
lineSchema.plugin(
	require('mongoose-unique-validator'), { 
		message: 'This line already exists'
	},
);


// Auto-increment ID for friendly URLs
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
lineSchema.plugin(autoIncrement.plugin, 'Line');


module.exports = mongoose.model('Line', lineSchema);
