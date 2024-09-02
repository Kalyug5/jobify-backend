import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/User.controller.js";
import { getUser, isAuthenticated } from "../middlewares/IsAuthenticated.js";
import { singleUpload } from "../middlewares/multerFile.js";

const user = express.Router();

user.post("/register", singleUpload, register);
user.post("/login", login);
user.get("/logout", logout);
user.post("/profile/update", isAuthenticated, singleUpload, updateProfile);
user.get("/getuser", getUser);

export default user;
