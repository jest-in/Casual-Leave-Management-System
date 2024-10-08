"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/helpers/axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [approvalsList, setApprovalsList] = useState([]);

  const router = useRouter();
  async function logoutBtnHandler() {
    try {
      await axiosInstance.get("/logout");
      router.push("/");
    } catch (error) {
      console.log("Failed to logout", error);
    }
  }

  async function fetchData() {
    try {
      const response = await axiosInstance.get("/leaves");
      setApprovalsList(response.data.body);
    } catch (error) {
      console.log("Failed to fetch", error);
    }
  }

  async function rejectBtnHandler(index, id) {
    try {
      const rejectReason = prompt("Reason for rejecting");
      if (!rejectReason) return;
      const response = await axiosInstance.patch("/leaves", {
        id,
        rejected: true,
        rejectReason,
      });
      setApprovalsList((prev) => {
        let updatedApprovalsList = [...prev];
        updatedApprovalsList[index] = response.data.body;
        return updatedApprovalsList;
      });
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  async function approveBtnHandler(index, id) {
    try {
      await axiosInstance.patch("/leaves", {
        id,
      });
      setApprovalsList((prev) => {
        let updatedApprovalsList = [...prev];
        updatedApprovalsList.splice(index, 1);
        return updatedApprovalsList;
      });
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <nav>
        <h1>Dashboard</h1>
        <button onClick={logoutBtnHandler}>Logout</button>
      </nav>
      <main>
        <section>
          {approvalsList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvalsList.map((document, index) => {
                  console.log("Approvers:", document.approvers);
                  let rejectReason = "";
                  const isRejected = document.approvers.some(
                    (approver, index) => {
                      if (approver.status === "Rejected")
                        rejectReason = approver.rejectReason;
                      return approver.status === "Rejected";
                    }
                  );
                  return (
                    <tr key={index}>
                      <td>{document.userId.username}</td>
                      <td>{document.description}</td>
                      <td>{new Date(document.date).toDateString()}</td>
                      <td>{document.leaveDuration}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <button
                            disabled={isRejected}
                            style={{
                              display: "inline-block",
                              backgroundColor: isRejected ? "red" : null,
                            }}
                            onClick={() =>
                              rejectBtnHandler(index, document._id)
                            }
                          >
                            {isRejected ? "Rejected" : "Reject"}
                          </button>
                          <div
                            style={{
                              display: "inline-block",
                              width: "10rem",
                              height: "2.5rem",
                              overflow: "auto",
                            }}
                          >
                            {rejectReason}
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => approveBtnHandler(index, document._id)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div>
              <strong>No Leaves to be approved</strong>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
