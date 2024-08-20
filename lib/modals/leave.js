import mongoose, { Schema, model, models } from "mongoose";

const LeaveSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    leaveType: {
      type: String,
      enum: [
        "casual leave",
        "special casual leave",
        "loss of pay",
        "compensatory leave",
      ],
    },
    date: {
      type: Date,
      required: true,
      // TODO: Faculty should be able to apply leave for the date, 1 week before or after today
      // validate: {
      //   validator: function (value) {
      //     return value > new Date();
      //   },
      //   message: (props) => `${props.value} is not greater than today's date!`,
      // },
    },
    leaveDuration: {
      type: String,
      enum: ["first half", "second half", "full day"],
      default: "full day",
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvers: [
      {
        approverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        rejectReason: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Leave = models.Leave || model("Leave", LeaveSchema);

export default Leave;
