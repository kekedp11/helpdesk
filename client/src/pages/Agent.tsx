import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAgentTickets,
  updateAgentTicket,
} from "../services/ticket.service";
import type { Ticket } from "../types/ticket.types";

function Agent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setError("");

      const data = await getAgentTickets();
      setTickets(data);
    } catch {
      setError("Failed to load assigned tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (
    ticketId: string,
    status: Ticket["status"]
  ) => {
    try {
      setError("");

      await updateAgentTicket(ticketId, status);
      await fetchTickets();
    } catch {
      setError("Failed to update ticket");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>

      <h1>Agent Dashboard</h1>

      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>

      {loading && <p>Loading tickets...</p>}
      {error && <p>{error}</p>}

      {!loading && tickets.length === 0 && (
        <p>No tickets assigned to you.</p>
      )}

      {tickets.map((ticket) => (
        <div key={ticket._id}>
          <h2>{ticket.title}</h2>
          <p>{ticket.description}</p>
          <p>Priority: {ticket.priority}</p>
          <p>Category: {ticket.category}</p>
          <p>Status: {ticket.status}</p>

          <select
            value={ticket.status}
            onChange={(event) =>
              handleStatusChange(
                ticket._id,
                event.target.value as Ticket["status"]
              )
            }
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default Agent;