import express from "express";
import { login, register } from "../controllers/auth.controller.js";

const app = express();

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

export default app;
