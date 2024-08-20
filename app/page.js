"use client";

import axiosInstance from "@/helpers/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  async function formSubmitHandler(e) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      const userData = response.data.body;
      switch (userData.role) {
        case "FACULTY":
          router.push("/dashboard");
          break;

        case "ADMIN":
          router.push("/admin");
          break;

        case "HOD":
        case "PRINCIPAL":
        case "HR":
          router.push("/approver");
          break;

        default:
          alert("Dashboard not found");
          break;
      }
    } catch (error) {
      console.log("Failed to fetch data", error);
    }
  }
  return (
    <div className="center">
      <form
        id="loginForm"
        autoComplete="off"
        onSubmit={(e) => formSubmitHandler(e)}
      >
        <div className="form-group">
          <h1>Login</h1>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div class="form-actions">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
