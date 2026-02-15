import { useState, useEffect } from "react";
import API from "../api";

function CreateTicketModal({ studentId, close }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (title.length > 3 && location.length > 2) {
      API.get(`/tickets/suggestions?query=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`)
        .then(res => setSuggestions(res.data))
        .catch(err => console.error(err));
    }
  }, [title, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/tickets", {
      title,
      location,
      description,
      student_id: studentId
    });
    close();
  };

  return (
    <div style={{
      position: "fixed",
      top: 50,
      left: "30%",
      width: "40%",
      background: "#fff",
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 8
    }}>
      <h3>Create Ticket</h3>

      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        /><br /><br />

        <input 
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        /><br /><br />

        <textarea 
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        /><br /><br />

        <button type="submit">Submit</button>
        <button type="button" onClick={close}>Cancel</button>
      </form>

      {suggestions.length > 0 && (
        <div style={{
          marginTop: 20,
          maxHeight: 150,
          overflowY: "scroll",
          border: "1px solid #ddd",
          padding: 10
        }}>
          <h4>Similar Issues</h4>
          {suggestions.map(s => (
            <div key={s.ticket_id}>
              <strong>{s.title}</strong>
              <p>Reports: {s.report_count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateTicketModal;
