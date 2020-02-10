
const mongoose = require('./../database');

/**
 * A city, only made of its name (as for now)
 */
const citySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
		type: String,
		required: [true, 'Name is mandatory'],
		unique: [true, 'This city already exists'],
		validate: name => {
			if (name.trim().length < 2) {
				throw new Error('Name must be at least 2 characters long');
			}
			return true;
		},
    },
}, { versionKey: false });


// Auto-validate unique fields
citySchema.plugin(
	require('mongoose-unique-validator'), { 
		message: 'This city already exists'
	},
);


// Auto-increment ID for friendly URLs
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
citySchema.plugin(autoIncrement.plugin, 'City');


module.exports = mongoose.model('City', citySchema);
