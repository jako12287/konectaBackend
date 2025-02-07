import express from "express";
import { verifyUser, verifyAdmin } from "../utils/middlewares/auth.js";
import {
  createRequest,
  deleteRequest,
  getRequestsAll,
  getRequestsByEmployee,
} from "../controllers/request.controller.js";

const app = express();

app.post("/api/request", verifyUser, verifyAdmin, createRequest);
app.delete("/api/request/:id_request", verifyUser, verifyAdmin, deleteRequest);
app.get("/api/request/:id_employee", verifyUser, getRequestsByEmployee);
app.get("/api/request/admin/all", verifyUser, verifyAdmin, getRequestsAll);


export default app;
