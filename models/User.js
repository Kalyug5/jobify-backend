import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employee", "recruiter"], required: true },
    phone: { type: Number, required: true },
    profile: {
      summary: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, // will come from cloudniary
      resumeOriginalName: { type: String },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
