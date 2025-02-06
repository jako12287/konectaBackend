import express from "express";
import { gethome } from "../controllers/home.controller.js";
export const app = express();


app.get("/", gethome)

export default app;