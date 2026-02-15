import { useEffect, useState } from "react";
import API from "../api";

function StatsCards({ studentId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get(`/users/${studentId}/stats`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [studentId]);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
      <Card title="Total" value={stats.total_reported} />
      <Card title="Open" value={stats.open} />
      <Card title="In Progress" value={stats.in_progress} />
      <Card title="Resolved" value={stats.resolved} />
      <Card title="Rejected" value={stats.rejected} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 8,
      minWidth: 100
    }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default StatsCards;
