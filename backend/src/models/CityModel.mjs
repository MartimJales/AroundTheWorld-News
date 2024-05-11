import { Schema, model } from 'mongoose';

const CitySchema = new Schema({
	city: {type: String},
	city_ascii: {type: String},
	location: {
		type: {
			type: String, // Don't do `{ location: { type: String } }`
			enum: ['Point'], // 'location.type' must be 'Point'
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	country: {type: String},
	iso2: {type: String},
	iso3: {type: String},
	capital: {type: String},
	admin_name: {type: String},
	population: {type: Number},
	id: {type: String},
})



export default model('City', CitySchema)
