import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "HOD", "HR", "PRINCIPAL", "FACULTY"],
    },
    department: { type: String, enum: ["CS", "MECH", "MCA", "MBA"] },
    leave_credits: {
      casual_leave: { type: Number, default: 0 },
      compensatory_leave: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
