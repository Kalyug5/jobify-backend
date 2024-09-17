import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db/db.js";
import user from "./routes/User.route.js";
import Company from "./routes/Company.route.js";
import Application from "./routes/Application.route.js";
import Job from "./routes/Job.route.js";

dotenv.config({});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
  origin: "https://jobify-tawny.vercel.app/",
  credentials: true,
};

app.use(cors(corsOption));

app.use("/api/v1/user", user);
app.use("/api/v1/company", Company);
app.use("/api/v1/job", Job);
app.use("/api/v1/application", Application);

app.listen(process.env.PORT || 8080, () => {
  connectDB()
    .then(() => {
      console.log(`Listening to the port ${process.env.PORT}`);

      console.log("connected to database");
    })
    .catch((err) => {
      console.log(err);
    });
});
