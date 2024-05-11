import fs from 'fs';
import mongoose from "mongoose"
import NewsModel from '../models/NewsModel.mjs';
import CityModel from '../models/CityModel.mjs';


function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export async function processDataSet(filePath) {
	const dataset = fs.readdirSync(filePath);
	for await (const dir of dataset) {
		const subdir = fs.readdirSync(filePath + "/" + dir);
		for await (const file of subdir) {
			const article = readJSONFile(`${filePath}/${dir}/${file}`);

			console.log(article.uuid);
			if (!article.title && !article.thread.title)
				continue;

			const cities = article.entities.locations.map(async (location) => {
				const city = await CityModel.findOne({ city:    location.name });
				if (city)
					return city._id;
			}).filter(l => mongoose.Types.ObjectId.isValid(l))

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
		}
	}
}
