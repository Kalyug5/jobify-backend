import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/getUri.js";
import cloudinary from "../utils/Cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, phone } = req.body;
    if (!fullName || !email || !password || !role || !phone) {
      return res.status(400).json({
        message: "Some Details is missing",
        success: false,
      });
    }

    console.log(fullName, role);

    console.log("here");

    const file = req.file;
    let cloudinaryResponse;
    if (file) {
      const fileUri = getDataUri(file);

      cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    console.log(cloudinaryResponse);
    console.log(file);

    console.log("h");

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User with this email already exist",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...req.body,
      password: hashedPassword,
      profile: {
        profilePhoto: file ? cloudinaryResponse.secure_url : "",
      },
    };

    user = new User(newUser);

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Some Details is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User with this email does not exist",
        success: false,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid Password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account with this role dosen't exist",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Login Successfull! Welcome ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: error,
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, summary, skills } = req.body;

    const file = req.file;
    console.log(file);

    const fileUri = getDataUri(file);

    const cloudinaryResponse = await cloudinary.uploader.upload(
      fileUri.content
    );

    //cloudNairy part

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id; //from middleware

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (summary) user.profile.summary = summary;
    if (skills) user.profile.skills = skillsArray;

    console.log(cloudinaryResponse.secure_url);

    if (cloudinaryResponse) {
      user.profile.resume = cloudinaryResponse.secure_url; // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname; // Save the original file name
    }

    //for resume

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      success: false,
    });
  }
};
