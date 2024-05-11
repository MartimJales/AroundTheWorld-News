import { Schema, model } from 'mongoose';

const NewsSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	URL: {
		type: String,
		required: true
	},

	date : {
		type: Date,
		required: true
	},
	country : {
		type: String,
	},

	description: {
		type: String,
	},
	language: {
		type: String,
	},

	categories: {
		type: [String],
		required: true
	},

	author: {
		type: String,
		required: true
	},
	cities : [{ type: Schema.Types.ObjectId, ref: 'City' }]
})


export default model('News', NewsSchema)
