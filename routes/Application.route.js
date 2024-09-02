import express from "express";
import { isAuthenticated } from "../middlewares/IsAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/Application.controller.js";

const Application = express.Router();

Application.get("/apply/:id", isAuthenticated, applyJob);
Application.get("/get", isAuthenticated, getAppliedJobs);
Application.get("/:jobId/applicants", isAuthenticated, getApplicants);

Application.post("/status/:id/update", isAuthenticated, updateStatus);

export default Application;
