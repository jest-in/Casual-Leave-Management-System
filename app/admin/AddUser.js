"use client";

import { useState } from "react";
import styles from "./AddUser.module.css";
import axiosInstance from "@/helpers/axios";

export default function AddUser() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FACULTY");
  const [department, setDepartment] = useState("");
  const [leaveCredits, setLeaveCredits] = useState({
    casual_leave: 0,
    compensatory_leave: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("admin/users", {
        email,
        username,
        password,
        role,
        department,
        leave_credits: leaveCredits,
      });
      alert("Added user");
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formHeading}>Add User</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input
          className={styles.input}
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className={styles.label} htmlFor="role">
          Role
        </label>
        <select
          className={styles.select}
          id="role"
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="FACULTY">Faculty</option>
          <option value="HOD">HOD</option>
          <option value="PRINCIPAL">Principal</option>
          <option value="HR">HR</option>
        </select>
        <label className={styles.label} htmlFor="department">
          Department
        </label>
        <select
          className={styles.select}
          id="department"
          name="department"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="CS">CS</option>
          <option value="MECH">MECH</option>
          <option value="MCA">MCA</option>
          <option value="MBA">MBA</option>
        </select>
        <input
          className={styles.input}
          id="department"
          name="department"
          type="text"
          required
        />
        <label className={styles.label} htmlFor="department">
          Casual Leave Credits
        </label>
        <input
          className={styles.input}
          id="department"
          name="department"
          type="text"
          required
          value={leaveCredits.casual_leave}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setLeaveCredits((prev) => ({
              ...prev,
              casual_leave: value || 0,
            }));
          }}
        />
        <label className={styles.label} htmlFor="department">
          Compensatory Leave Credits
        </label>
        <input
          className={styles.input}
          id="department"
          name="department"
          type="text"
          required
          value={leaveCredits.compensatory_leave}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setLeaveCredits((prev) => ({
              ...prev,
              compensatory_leave: value || 0,
            }));
          }}
        />
        <button className={styles.button} type="submit">
          Add User
        </button>
      </form>
    </div>
  );
}
