import { Router } from "express";
import NewsModel from "../models/NewsModel.mjs";

const api = Router();

api.get("/feed", async (req, res) => {

	const news = await NewsModel.find({});
    return res.json(news);
});

api.get("/healthcheck", (req, res) => {
    return res.status(200).send("OK!");
});



export default api;
