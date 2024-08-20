"use client";

import axiosInstance from "@/helpers/axios";
import { useState } from "react";

export default function ApplyLeaveModal({ setLeaves, closeModal }) {
  const [leaveType, setLeaveType] = useState("casual leave");
  const [leaveDuration, setLeaveDuration] = useState("full day");
  const [description, setDescription] = useState(undefined);
  const [date, setDate] = useState(undefined);
  async function submitHandler(e) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("leaves", {
        leaveType,
        date,
        leaveDuration,
        description,
      });
      const leave = response.data.body;
      console.log("Leave added", response.data);
      setLeaves((prev) => [...prev, leave]);
      closeModal();
    } catch (error) {
      console.log("Could not add leave", error);
    }
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times; {/* "X" mark */} Close
        </button>
        <form onSubmit={(e) => submitHandler(e)}>
          <select
            value={leaveType}
            name="leaveType"
            id="leaveType"
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="casual leave">Casual Leave</option>
            <option value="special casual leave">Special Casual Leave</option>
            <option value="loss of pay">Loss of Pay</option>
            <option value="compensatory leave">Compensatory Leave</option>
          </select>
          <select
            value={leaveDuration}
            name="leaveDuration"
            id="leaveDuration"
            onChange={(e) => setLeaveDuration(e.target.value)}
            required
          >
            <option value="first half">First Half</option>
            <option value="second half">Second Half</option>
            <option value="full day">Full Day</option>
          </select>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            name="date"
            id="date"
            placeholder="date"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Apply</button>
        </form>
      </div>
    </div>
  );
}
