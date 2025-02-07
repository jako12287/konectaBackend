import express from "express";
import { verifyUser, verifyAdmin } from "../utils/middlewares/auth.js";
import {
  createRequest,
  getRequestsAll,
  getRequestsByEmployee,
} from "../controllers/request.controller.js";

const app = express();

app.post("/api/request", verifyUser, createRequest);
app.get("/api/request/:id_employee", verifyUser, getRequestsByEmployee);
app.get("/api/request/admin/all", verifyUser, verifyAdmin, getRequestsAll);

export default app;
