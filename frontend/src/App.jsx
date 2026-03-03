import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import OfficeDashboard from "./pages/OfficeDashboard";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [serverReady, setServerReady] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const wakeServer = async () => {
      // Start timer — only show loader after 2 seconds
      const timer = setTimeout(() => {
        setShowLoader(true);
      }, 2000);

      try {
        const res = await fetch(`${API_URL}/health`);
        if (res.ok) {
          clearTimeout(timer);
          setServerReady(true);
        }
      } catch (err) {
        setShowLoader(true);

        // Retry if sleeping
        let ready = false;
        while (!ready) {
          try {
            const retry = await fetch(`${API_URL}/health`);
            if (retry.ok) {
              ready = true;
              setServerReady(true);
            }
          } catch {}
          await new Promise((r) => setTimeout(r, 10000));
        }
      }
    };

    wakeServer();
  }, []);

  if (!serverReady && showLoader) {
    return (
      <div className="loading-container">
        <h1 className="namaste">नमस्ते</h1>
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

  if (!serverReady) return null; // Don't flash loader

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