import express from "express";
import { login, register } from "../controllers/user.controller.js";

const app = express();

app.post("/api/users/register", register);
app.post("/api/users/login", login);

export default app;
