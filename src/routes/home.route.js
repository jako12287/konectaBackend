import express from "express";
import { gethome } from "../controllers/home.controller.js";
const app = express();


app.get("/", gethome)

export default app;