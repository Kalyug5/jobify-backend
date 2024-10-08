import express from "express";
import { isAuthenticated } from "../middlewares/IsAuthenticated.js";
import {
  createJob,
  getAdminJobs,
  getAllJobs,
  getJobById,
  getSpecificCompanyJob,
} from "../controllers/Job.controller.js";

const Job = express.Router();

Job.get("/get", getAllJobs);
Job.get("/companyjob/:companyId", isAuthenticated, getSpecificCompanyJob);
Job.post("/", isAuthenticated, createJob);
Job.get("/admin", isAuthenticated, getAdminJobs);
Job.get("/:id", getJobById);

export default Job;
