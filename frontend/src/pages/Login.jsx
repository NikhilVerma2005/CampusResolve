import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      const { user_id, role, office } = res.data;

      // Store user info
      localStorage.setItem("userId", user_id);
      localStorage.setItem("role", role);
      if (office) {
        localStorage.setItem("officeName", office);
      }

      // Redirect based on role
      if (role === "STUDENT") {
        navigate("/student");
      } else {
        navigate("/office/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Login</button>
      </form>

      <br />

      <Link to="/signup">Don't have an account? Signup</Link>
    </div>
  );
}

export default Login;
