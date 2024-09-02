import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;
    console.log(id);

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    //check weather you have already applied for this job or not
    const alreadyApplied = await Application.findOne({
      jobId: id,
      applicant: userId,
    });
    if (alreadyApplied)
      return res
        .status(400)
        .json({ msg: "You have already applied to this position" });

    const applicationData = {
      jobId: id,
      applicant: userId,
    };
    const newApplication = new Application(applicationData);
    await newApplication.save();
    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .populate({
        path: "jobId",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "companyId",
          options: { sort: { createdAt: -1 } },
        },
      })
      .sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({ msg: "No jobs applied yet" });
    }
    return res.status(200).json({ application, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      succees: true,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
