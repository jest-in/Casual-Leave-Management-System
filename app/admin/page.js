"use client";

import axiosInstance from "@/helpers/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./AdminDashboard.module.css";
import AddUser from "./AddUser";
import ResetPassword from "./ResetPassword";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("add-user");

  const router = useRouter();
  async function logoutBtnHandler() {
    try {
      await axiosInstance.get("/logout");
      router.push("/");
    } catch (error) {
      console.log("Failed to logout", error);
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case "add-user":
        return (
          <div className={styles.section}>
            <AddUser />
          </div>
        );
      case "reset-password":
        return (
          <div className={styles.section}>
            <ResetPassword />
          </div>
        );
      case "settings":
        return <div className={styles.section}>Settings Section</div>;
      default:
        return <div className={styles.section}>Home Section</div>;
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div className={styles.buttonGroup}>
          <button
            className={styles.navLink}
            onClick={() => setActiveSection("add-user")}
          >
            Add User
          </button>
          <button
            className={styles.navLink}
            onClick={() => setActiveSection("reset-password")}
          >
            Reset User Password
          </button>
          {/* <button
            className={styles.navLink}
            onClick={() => setActiveSection("settings")}
          >
            Settings
          </button> */}
        </div>
        <button className={styles.logoutButton} onClick={logoutBtnHandler}>
          Logout
        </button>
      </nav>
      <main className={styles.mainContent}>{renderSection()}</main>
    </div>
  );
}
