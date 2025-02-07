import express from "express";

import { getEmployees } from "../controllers/employees.controller.js";
import { verifyUser, verifyAdmin } from "../utils/middlewares/auth.js";

const app = express();

app.get("/api/employees", verifyUser, verifyAdmin, getEmployees);

export default app;
