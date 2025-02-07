import express from "express";

import { getEmployees } from "../controllers/employees.controller.js";
import { authMiddleware, verifyAdmin } from "../utils/middlewares/auth.js";

const app = express();

app.get("/api/employees", authMiddleware, verifyAdmin, getEmployees);

export default app;
