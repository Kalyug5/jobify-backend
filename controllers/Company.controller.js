import cloudinary from "../utils/Cloudinary.js";
import getDataUri from "../utils/getUri.js";
import Company from "./../models/Company.js";

export const registerCompany = async (req, res) => {
  try {
    const { name, website } = req.body;

    console.log(req.body);

    const file = req.file;
    let cloudinaryResponse;
    if (file) {
      const fileUri = getDataUri(file);

      cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content);
    }
    const logo = cloudinaryResponse ? cloudinaryResponse?.secure_url : null;

    if (!name || !website) {
      return res.status(400).json({
        message: "Please name and give link to your company",
        success: false,
      });
    }
    const isCompanyExist = await Company.findOne({ name: name });
    console.log(isCompanyExist);

    if (isCompanyExist) {
      return res
        .status(400)
        .json({ message: "Company already exist", success: false });
    }

    const data = {
      ...req.body,
      userId: req.id,
      logo: logo,
    };

    const company = new Company(data);
    await company.save();
    res
      .status(201)
      .json({ message: "Company created successfully", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getCompanyByUser = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (companies.length === 0) {
      return res
        .status(404)
        .json({ message: "No company found", success: false });
    }
    res
      .status(200)
      .json({ message: "Company found", success: true, data: companies });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Company found", success: true, data: company });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // logo should come later via cloudnairy

    const file = req.file;
    let cloudinaryResponse;
    if (file) {
      const fileUri = getDataUri(file);

      cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content);
    }
    const logo = cloudinaryResponse ? cloudinaryResponse?.secure_url : null;

    const data = { ...req.body, logo };

    const company = await Company.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Company updated", success: true, data: company });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
