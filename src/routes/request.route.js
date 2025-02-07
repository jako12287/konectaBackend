import express from "express";
import { verifyUser } from "../utils/middlewares/auth.js";
import {
  createRequest,
  getRequestsByEmployee,
} from "../controllers/request.controller.js";

const app = express();

app.post("/api/request", verifyUser, createRequest);
app.get("/api/request/:id_employee", verifyUser, getRequestsByEmployee);

export default app;
