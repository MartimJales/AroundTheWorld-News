import { Router } from "express";
import NewsModel from "../models/NewsModel.mjs";
import CityModel from "../models/CityModel.mjs";

const api = Router();

const categoryMap = {
	"business": "Economy, Business and Finance",
	"politics": "Politics",
	"health": "Health",
	"science": "Science and Technology",
	"sports": "Sport",
	"crime": "Crime, Law and Justice"
}

api.get("/feed", async (req, res) => {


	const queryCategories = req.query.categories ? req.query.categories.split(',') : [];
	const categories = [];
	queryCategories.forEach(cat => { categories.push(categoryMap[cat]) });

	const news = await NewsModel.find({}).populate('cities').lean();

	const toReturn = new Map();
	const citiesMap = new Map();

	const returnObject = {
		NEWS: []
	}

	news.forEach(n => {
		if (categories.length == 0 || categories.some(cat => n.categories.includes(cat))) {
			n.cities.forEach(c => {
				if (!toReturn.has(c.city)) {
					toReturn.set(c.city, []);
				}
				toReturn.get(c.city).push(n._id);
				if (!citiesMap.has(c.city)) {
					citiesMap.set(c.city, c);
				}
			});
		}
	});

	console.log(toReturn);

	toReturn.forEach((value, key) => {
		returnObject.NEWS.push({
			id: key,
			radius: value.length * 1000,
			city: key,
			lat: citiesMap.get(key).location.coordinates[1],
			lng: citiesMap.get(key).location.coordinates[0],
		});
	})


	console.log(news.length);

	return res.json(returnObject);
});

api.get("/news", async (req, res) => {
	const news = await NewsModel.find({}).populate('cities');
	const returnObject = [];

	news.forEach(n => {
		n.cities.forEach(c => {
			if (c.city === req.query.city) {
				console.log(n)
				returnObject.push(n);
			}
		})
	})

	console.log(returnObject);
	res.json(returnObject);
});


api.get("/city", async (req, res) => {
	const lat = +req.query.lat;
	const lng = +req.query.lng;
	// Find the city that is closest to the provided coordinates
	const city = await CityModel.findOne({
		location: {
			$near: {
				$geometry: {
					type: "Point",
					coordinates: [lng, lat]
				}
			}
		}
	}).lean();
	res.json(city);
});

api.get("/healthcheck", (req, res) => {
	return res.status(200).send("OK!");
});



export default api;
