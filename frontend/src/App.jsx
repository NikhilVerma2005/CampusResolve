import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import OfficeDashboard from "./pages/OfficeDashboard";

const API_URL = "https://campusresolve-05m5.onrender.com"; 

function App() {
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    const wakeServer = async () => {
      let ready = false;

      while (!ready) {
        try {
          const res = await fetch(`${API_URL}/health`);
          if (res.ok) {
            ready = true;
            setServerReady(true);
          }
        } catch (err) {
          console.log("Backend sleeping...");
        }

        if (!ready) {
          await new Promise((r) => setTimeout(r, 10000));
        }
      }
    };

    wakeServer();
  }, []);


  if (!serverReady) {
  return (
    <div className="loading-container">
      <h1 className="namaste">🙏🏻नमस्ते </h1>

      <div className="progress-bar">
        <div className="progress"></div>
      </div>

      <h2>Initializing Server...</h2>
      <p className="small-text">
        First request may take up to 60 seconds (free hosting).
      </p>
    </div>
  );
}

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/office/dashboard" element={<OfficeDashboard />} />
    </Routes>
  );
}

export default App;