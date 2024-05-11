import CityModel from "./models/CityModel.mjs";
import mongoose from "mongoose";
import fs from "fs";

await mongoose.connect('mongodb://localhost:27017/chentech');
const cities = JSON.parse(fs.readFileSync("./cities.json", "utf-8"));

console.log("Inserting cities into the database...");
for await (const c of cities) {
    await CityModel.create({
        city: c.city.toLowerCase(),
	    city_ascii: c.city_ascii.toLowerCase(),
        location: {
            type: "Point",
            coordinates: [c.lng, c.lat]
        },
        country: c.country.toLowerCase(),
        iso2: c.iso2,
        iso3: c.iso3,
        capital: c.capital,
        admin_name: c.admin_name,
        population: c.population,
        id: c.id,
    });
}
console.log("Cities inserted successfully!")
