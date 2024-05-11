import express from 'express';
import mongoose from 'mongoose';
import api from "./api/index.mjs";


// const result = await db.select().from('users').execute();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", express.static("public"));

app.use((req, res, next) => {
	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
	});
	next();
})

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
// app.get('*', (req, res) => res.status(404).send('Not Found'));

await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/chentech');
app.listen(3000, () => console.log('Server is running on port 3000'));
