import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
    </Routes>
  );
}

export default App;
