import { useEffect, useState } from "react";
import API from "../api";
import "../App.css";

function StatsCards({ studentId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get(`/users/${studentId}/stats`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [studentId]);

  if (!stats) return null;

  const cards = [
    { title: "Total Complaints", value: stats.total_reported },
    { title: "Open", value: stats.open },
    { title: "In Progress", value: stats.in_progress },
    { title: "Resolved", value: stats.resolved },
    { title: "Rejected", value: stats.rejected }
  ];

  return (
    <div className="stats-row">
      {cards.map((card, index) => (
        <div key={index} className="stat-card-fixed">
          <div className="stat-title-fixed">{card.title}</div>
          <div className="stat-number-fixed">{card.value}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
