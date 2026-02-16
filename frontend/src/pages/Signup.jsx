import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../App.css";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    office: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful");
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: 500, margin: "auto" }}>
        <h2 style={{ marginBottom: 20 }}>Create Account</h2>

        <form onSubmit={handleSignup}>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <br /><br />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <br /><br />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <br /><br />

          <select name="role" onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="STUDENT">Student</option>
            <option value="STAFF">Staff</option>
          </select>
          <br /><br />

          {form.role === "STAFF" && (
            <>
              <select name="office" onChange={handleChange}>
                <option value="">Select Office</option>
                <option value="HOSTEL_OFFICE">Hostel Office</option>
                <option value="ACADEMIC_OFFICE">Academic Office</option>
                <option value="CAMPUS_FACILITIES">Campus Facilities</option>
                <option value="GENERAL_ADMIN">General Admin</option>
              </select>
              <br /><br />
            </>
          )}

          <button type="submit" style={{ width: "100%" }}>
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
