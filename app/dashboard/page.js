"use client";

import { useRouter } from "next/navigation";
import ApplyLeaveModal from "./ApplyLeaveModal";
import { useEffect, useState } from "react";
import axiosInstance from "@/helpers/axios";
import styles from "./LeaveCards.module.css";

export default function Dashboard() {
  const [leaves, setLeaves] = useState([]);

  const [leaveCredits, setLeaveCredits] = useState({
    casual_leave: 0,
    compensatory_leave: 0,
  });

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const router = useRouter();
  async function logoutBtnHandler() {
    try {
      await axiosInstance.get("/logout");
      router.push("/");
    } catch (error) {
      console.log("Failed to logout", error);
    }
  }

  function closeModal() {
    setLeaveModalOpen(false);
  }

  async function fetchData() {
    const userResponse = await axiosInstance.get("/me");
    const userData = userResponse.data.body;
    const userCreditsResponse = await axiosInstance.get(
      `/leaves/${userData.id}/leave-credits`
    );
    setLeaveCredits(userCreditsResponse.data.body.leave_credits);
    const response = await axiosInstance.get(`/leaves/${userData.id}`);
    setLeaves(response.data.body);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {leaveModalOpen && (
        <ApplyLeaveModal closeModal={closeModal} setLeaves={setLeaves} />
      )}
      <nav>
        <h1>Dashboard</h1>
        <button onClick={logoutBtnHandler}>Logout</button>
      </nav>
      <main>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Casual Leave Credits</div>
            <div className={styles.cardValue}>{leaveCredits.casual_leave}</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Compensatory Leave Credits</div>
            <div className={styles.cardValue}>
              {leaveCredits.compensatory_leave}
            </div>
          </div>
        </div>
        <section>
          <div>
            <h2>Applied leaves</h2>
            <button onClick={() => setLeaveModalOpen(true)}>Apply</button>
          </div>
          {leaves.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Leave Type</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, index) => {
                  let rejectReason = "";
                  const isRejected = leave.approvers.some((approver) => {
                    if (approver.status === "Rejected")
                      rejectReason = approver.rejectReason;
                    return approver.status === "Rejected";
                  });
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{leave.leaveType}</td>
                      <td>{leave.description}</td>
                      <td>{new Date(leave.date).toDateString()}</td>
                      <td>{leave.leaveDuration}</td>
                      <td>
                        <div>
                          <span className={`${leave.status.toLowerCase()}`}>
                            {leave.status}
                          </span>
                          <span>{isRejected ? rejectReason : ""}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div>
              <strong>Nothing to show</strong>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
