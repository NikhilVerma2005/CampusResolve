import { useState, useEffect } from "react";
import API from "../api";

function CreateTicketModal({ studentId, close }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Live Suggestions
  useEffect(() => {
    if (!title.trim() || !location) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await API.get(
          `/tickets/suggestions?query=${encodeURIComponent(
            title
          )}&location=${encodeURIComponent(location)}`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestions();
  }, [title, location]);

  // ✅ Create New Ticket
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !location || !description) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/tickets", {
        title,
        location,
        description,
        student_id: studentId,
      });
      close();
    } catch (err) {
      console.error(err);
      alert("Error creating ticket");
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Join Existing Issue
  const handleJoin = async (ticketId) => {
    try {
      await API.post(`/tickets/${ticketId}/join`, {
        student_id: studentId,
        description: description || "Joining existing issue",
      });
      close();
    } catch (err) {
      console.error(err);
      alert("Error joining issue");
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        {/* Modal Box */}
        <div
          style={{
            width: "500px",
            background: "#fff",
            padding: 25,
            borderRadius: 10,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <h2>Create New Ticket</h2>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <input
              placeholder="Issue Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
            <br />
            <br />

            {/* Location Dropdown */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            >
              <option value="">Select Location</option>
              <option value="Hostel 1">Hostel 1</option>
              <option value="Hostel 2">Hostel 2</option>
              <option value="TB-6">TB-6</option>
              <option value="TB-7">TB-7</option>
              <option value="Library">Library</option>
              <option value="Auditorium">Auditorium</option>
            </select>
            <br />
            <br />

            {/* Description */}
            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
            <br />
            <br />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={close}
              style={{ marginLeft: 10 }}
            >
              Cancel
            </button>
          </form>

          {/* Suggestions Section */}
          {suggestions.length > 0 && (
            <div
              style={{
                marginTop: 25,
                borderTop: "1px solid #ddd",
                paddingTop: 15,
              }}
            >
              <h3>Similar Existing Issues</h3>

              <div
                style={{
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {suggestions.map((s) => (
                  <div
                    key={s.ticket_id}
                    style={{
                      border: "1px solid #ddd",
                      padding: 10,
                      marginBottom: 10,
                      borderRadius: 6,
                    }}
                  >
                    <strong>{s.title}</strong>
                    <p>Priority: {s.priority}</p>
                    <p>Reports: {s.report_count}</p>

                    <button
                      onClick={() => handleJoin(s.ticket_id)}
                    >
                      Join This Issue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateTicketModal;
