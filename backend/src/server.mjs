import express from 'express';
import mongoose from 'mongoose';
import api from "./api/index.mjs";
import { processDataSet } from './utils/utils.mjs';


// const result = await db.select().from('users').execute();
const app = express();



app.use(express.urlencoded({extended: true}));
app.use(express.json());


/**
 * API routes
 * Handle the API routes
*/
app.use('/api', api);

/**
 * UI Route
 * Handle the UI rendering
 * TODO: Implement UI rendering with Docker build
*/
app.get('*', (req, res) => res.status(404).send('Not Found'));

await mongoose.connect('mongodb://localhost:27017/chentech');

console.log('Server is processing dataSet')

await processDataSet('dataset');

app.listen(3000, () => console.log('Server is running on port 3000'));