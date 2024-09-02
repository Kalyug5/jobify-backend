import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "Please login to access this resource" });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ msg: "Token is invalid" });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      msg: "Server error",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "Please login to access this resource" });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ msg: "Token is invalid" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Server error",
    });
  }
};
