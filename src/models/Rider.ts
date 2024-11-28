import mongoose from "mongoose";

const RiderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    surName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    district: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },
    park: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    isPrinted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Rider = mongoose.models?.Rider || mongoose.model("Rider", RiderSchema);

export default Rider;
