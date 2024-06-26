import fs from 'fs';
import NewsModel from './models/NewsModel.mjs';
import CityModel from './models/CityModel.mjs';

function readJSONFile(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function processDataSet(filePath) {
	const dataset = fs.readdirSync(filePath);
	for await (const dir of dataset) {
		const subdir = fs.readdirSync(filePath + "/" + dir);
		for await (const file of subdir) {
			const article = readJSONFile(`${filePath}/${dir}/${file}`);

			if (!article.title && !article.thread.title)
				continue;

			const cities = [];
			for await (const location of article.entities.locations) {
				const city = await CityModel.findOne({ city: location.name });
				if (city)
					cities.push(city._id);
			}

			if (cities.length === 0)
				continue;

			await NewsModel.create({
				title: article.title ?? article.thread.title,
				URL: article.url ?? "default",
				country: article.country,
				description: article.text,
				language: article.language,
				categories: article.categories,
				author: article.author ?? article.thread.site,
				date: new Date(article.published),
				cities: cities,
			});

			console.log("Inserted Loader", article.uuid);
		}
	}
}

if ((await NewsModel.countDocuments()) === 0) {

	console.log("Processing dataset...");
	await processDataSet('dataset');
}

console.log("Dataset processed successfully!");