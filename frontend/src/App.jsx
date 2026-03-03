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
      let loaderTimer;

      try {
        // Start health check
        const healthRequest = fetch(`${API_URL}/health`);

        // Start delayed loader (3 seconds threshold)
        loaderTimer = setTimeout(() => {
          setShowLoader(true);
        }, 3000);

        const response = await healthRequest;

        clearTimeout(loaderTimer);

        if (response.ok) {
          setServerReady(true);
          return;
        }
      } catch (err) {
        setShowLoader(true);
      }

      // If we reach here → server likely sleeping
      let ready = false;

      while (!ready) {
        try {
          const retry = await fetch(`${API_URL}/health`);
          if (retry.ok) {
            ready = true;
            setServerReady(true);
          }
        } catch {}

        await new Promise((r) => setTimeout(r, 8000));
      }
    };

    wakeServer();
  }, []);

  // Show loader ONLY if server is slow
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

  // If checking but fast → render nothing (no flash)
  if (!serverReady) return null;

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