import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTickets } from "../services/ticket.service";
import type { Ticket } from "../types/ticket.types";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Role: {user?.role}</p>

      <button
        onClick={() => {
            logout();
            navigate("/login");
        }}
      >
        Logout
      </button>

      <button onClick={() => navigate("/tickets/create")}>
        Create Ticket
      </button>

      {user?.role === "ADMIN" && (
        <button onClick={() => navigate("/admin")}>
          Admin Dashboard
        </button>
      )}

      {user?.role === "AGENT" && (
        <button onClick={() => navigate("/agent")}>
          Agent Dashboard
        </button>
      )}

      <p>Total tickets: {tickets.length}</p>

      {tickets.map((ticket) => (
        <div key={ticket._id}>
          <h2>{ticket.title}</h2>

          <p>{ticket.description}</p>

          <p>Status: {ticket.status}</p>
          <p>Priority: {ticket.priority}</p>
          <p>Category: {ticket.category}</p>

          <button
            onClick={() =>
              navigate(`/tickets/${ticket._id}`)
            }
          >
            View Details
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;