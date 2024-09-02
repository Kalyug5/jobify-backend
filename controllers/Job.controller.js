import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    req.body.created_by = req.id;
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating job",
      error: error.message,
    });
  }
};

//done by student
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "companyId",
      })
      .sort({ createdAt: -1 });
    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    return res.status(200).json({
      message: "Jobs retrieved successfully",
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving jobs",
      error: error.message,
    });
  }
};

//for student

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id)
      .populate({
        path: "applications",
      })
      .populate({
        path: "companyId",
      });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving jobs",
      error: error.message,
    });
  }
};

//get the list of jobs created by admin

export const getAdminJobs = async (req, res) => {
  try {
    const userId = req.id;
    const jobs = await Job.find({ created_by: userId }).populate({
      path: "companyId",
      createdAt: -1,
    });
    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }
    return res.status(200).json({ jobs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving jobs", error: error.message });
  }
};

export const getSpecificCompanyJob = async (req, res) => {
  try {
    const { companyId } = req.params;
    const jobs = await Job.find({ companyId: companyId });
    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving jobs", error: error.message });
  }
};
