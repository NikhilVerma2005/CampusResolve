import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", form);
      alert("Signup successful. Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        /><br /><br />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        /><br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        /><br /><br />

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
              <option value="FACILITIES_OFFICE">Facilities Office</option>
              <option value="GENERAL_ADMIN">General Admin</option>
            </select>
            <br /><br />
          </>
        )}

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
