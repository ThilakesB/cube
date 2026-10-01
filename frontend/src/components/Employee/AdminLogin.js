import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // Add styles for the login form

function AdminLogin() {
  const navigate = useNavigate();
  const [adminID, setAdminID] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (password !== "admin123" && !passwordRegex.test(password)) {
      return "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminID === "admin" && password === "admin123") {
      navigate("/dashboard");
      return;
    }
    if (passwordError) {
      alert("Please fix the password issues before logging in.");
      return;
    }
    console.log("Admin ID:", adminID);
    console.log("Password:", password);
    alert("Invalid credentials");
  };

  return (
    <div className="admin-login">
      <h3>CubeAi Solution</h3>
      <h2>Admin Login</h2>
      <div className="underline"></div>
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Admin ID"
            value={adminID}
            onChange={(e) => setAdminID(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            
          </button>
        </div>
        {passwordError && <p className="error-message">{passwordError}</p>}
        <div className="options">
          <label>
            <input type="checkbox" />
            Remember
          </label>
          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <button type="button" className="google-login-btn">
          Login with Google <span className="google-icon">G</span>
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
