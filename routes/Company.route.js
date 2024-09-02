import express from "express";
import {
  getCompanyById,
  getCompanyByUser,
  registerCompany,
  updateCompany,
} from "../controllers/Company.controller.js";
import { isAuthenticated } from "../middlewares/IsAuthenticated.js";
import { singleUpload } from "../middlewares/multerFile.js";

const Company = express.Router();

Company.post("/register", isAuthenticated, singleUpload, registerCompany);
Company.get("/get", isAuthenticated, getCompanyByUser);
Company.get("/:id", isAuthenticated, getCompanyById);
Company.put("/:id", isAuthenticated, updateCompany);

export default Company;
