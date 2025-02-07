import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { verifyAdmin, verifyUser } from "../utils/middlewares/auth.js";

const app = express();

app.post("/api/auth/register", verifyUser, verifyAdmin, register);
app.post("/api/auth/login", login);

export default app;
