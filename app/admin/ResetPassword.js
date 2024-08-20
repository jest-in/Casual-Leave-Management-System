"use client";

import { useState } from "react";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }
    // Handle form submission here
    console.log({ email, newPassword });
    // Reset the form or display success message
  };

  return (
    <div className={styles.formContainer}>
      <button
        className={styles.closeButton}
        onClick={() => console.log("Close Modal")}
      >
        ×
      </button>
      <h2 className={styles.formHeading}>Reset Password</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}
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
        <label className={styles.label} htmlFor="newPassword">
          New Password
        </label>
        <input
          className={styles.input}
          id="newPassword"
          name="newPassword"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label className={styles.label} htmlFor="confirmPassword">
          Confirm New Password
        </label>
        <input
          className={styles.input}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className={styles.button} type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}
