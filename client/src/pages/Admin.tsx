
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAdminTickets,
  updateAdminTicket,
  getAdminAgents,
  assignTicketToAgent,
} from "../services/ticket.service";
import type { Agent } from "../services/ticket.service";
import type { Ticket } from "../types/ticket.types";

function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  });

  const fetchTickets = async () => {
    try {
      setError("");
      const data = await getAdminTickets();
      setTickets(data);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await getAdminAgents();
      setAgents(data);
    } catch {
      setError("Failed to load agents");
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  const handleEditClick = (ticket: Ticket) => {
    setError("");
    setMessage("");
    setEditingId(ticket._id);
    setEditForm({
      title: ticket.title,
      description: ticket.description,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
    });
  };

  const handleSaveEdit = async (ticketId: string) => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setError("");
      setMessage("");
      setUpdatingId(ticketId);

      const updatedTicket = await updateAdminTicket(ticketId, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
      });

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket._id === ticketId ? updatedTicket : ticket
        )
      );

      setEditingId(null);
      setEditForm({ title: "", description: "" });
      setMessage("Ticket updated successfully");
    } catch {
      setError("Failed to update ticket");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (
    ticketId: string,
    status: Ticket["status"]
  ) => {
    try {
      setError("");
      setMessage("");
      setUpdatingId(ticketId);

      const updatedTicket = await updateAdminTicket(ticketId, {
        status,
      });

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket._id === ticketId ? updatedTicket : ticket
        )
      );

      setMessage("Ticket status updated successfully");
    } catch {
      setError("Failed to update ticket status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTicketFieldChange = async (
    ticketId: string,
    fields: Partial<Pick<Ticket, "priority" | "category">>
  ) => {
    try {
      setError("");
      setMessage("");
      setUpdatingId(ticketId);

      const updatedTicket = await updateAdminTicket(ticketId, fields);

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket._id === ticketId ? updatedTicket : ticket
        )
      );

      setMessage("Ticket updated successfully");
    } catch {
      setError("Failed to update ticket");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignAgent = async (ticketId: string) => {
    const agentId = selectedAgents[ticketId];

    if (!agentId) {
      setError("Please select an agent first");
      return;
    }

    try {
      setError("");
      setMessage("");
      setUpdatingId(ticketId);

      await assignTicketToAgent(ticketId, agentId);
      await fetchTickets();

      setMessage("Agent assigned successfully");
    } catch {
      setError("Failed to assign agent");
    } finally {
      setUpdatingId(null);
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

      <h1>Admin Dashboard</h1>

      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>

      {loading && <p>Loading tickets...</p>}
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {!loading && tickets.length === 0 && (
        <p>No tickets found.</p>
      )}

      {tickets.map((ticket) => (
        <div key={ticket._id}>
          {editingId === ticket._id ? (
            <div>
              <div>
                <label htmlFor={`title-${ticket._id}`}>
                  Title:
                </label>
                <input
                  id={`title-${ticket._id}`}
                  value={editForm.title}
                  disabled={updatingId === ticket._id}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label htmlFor={`description-${ticket._id}`}>
                  Description:
                </label>
                <textarea
                  id={`description-${ticket._id}`}
                  value={editForm.description}
                  disabled={updatingId === ticket._id}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </div>

              <button
                type="button"
                disabled={updatingId === ticket._id}
                onClick={() => handleSaveEdit(ticket._id)}
              >
                {updatingId === ticket._id ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                disabled={updatingId === ticket._id}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h2>{ticket.title}</h2>

              <p>
                Created By: {ticket.createdBy.name} (
                {ticket.createdBy.email})
              </p>

              <p>{ticket.description}</p>

              <button
                type="button"
                disabled={updatingId === ticket._id}
                onClick={() => handleEditClick(ticket)}
              >
                Edit
              </button>
            </div>
          )}

          <p>
            <label htmlFor={`priority-${ticket._id}`}>
              Priority:
            </label>{" "}
            <select
              id={`priority-${ticket._id}`}
              value={ticket.priority}
              disabled={updatingId === ticket._id}
              onChange={(event) =>
                handleTicketFieldChange(ticket._id, {
                  priority: event.target.value as Ticket["priority"],
                })
              }
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </p>

          <p>
            <label htmlFor={`category-${ticket._id}`}>
              Category:
            </label>{" "}
            <select
              id={`category-${ticket._id}`}
              value={ticket.category}
              disabled={updatingId === ticket._id}
              onChange={(event) =>
                handleTicketFieldChange(ticket._id, {
                  category: event.target.value as Ticket["category"],
                })
              }
            >
              <option value="TECHNICAL">TECHNICAL</option>
              <option value="ACCOUNT">ACCOUNT</option>
              <option value="BILLING">BILLING</option>
              <option value="OTHER">OTHER</option>
            </select>
          </p>

          <p>
            Assigned Agent: {ticket.assignedTo?.name ?? "Unassigned"}
          </p>

          <p>Status: {ticket.status}</p>

          <label htmlFor={`status-${ticket._id}`}>
            Change status:
          </label>{" "}

          <select
            id={`status-${ticket._id}`}
            value={ticket.status}
            disabled={updatingId === ticket._id}
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

          <div>
            <label htmlFor={`agent-${ticket._id}`}>
              Assign to agent:
            </label>{" "}

            <select
              id={`agent-${ticket._id}`}
              value={selectedAgents[ticket._id] ?? ""}
              disabled={
                updatingId === ticket._id || agents.length === 0
              }
              onChange={(event) =>
                setSelectedAgents((current) => ({
                  ...current,
                  [ticket._id]: event.target.value,
                }))
              }
            >
              <option value="">Select an agent</option>

              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={
                updatingId === ticket._id ||
                !selectedAgents[ticket._id]
              }
              onClick={() => handleAssignAgent(ticket._id)}
            >
              {updatingId === ticket._id
                ? "Saving..."
                : "Assign Agent"}
            </button>
          </div>

          {updatingId === ticket._id && (
            <p>Updating ticket...</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Admin;