import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../services/ticket.service";
import type {
  Ticket,
  TicketPriority,
  TicketCategory,
  TicketStatus,
} from "../types/ticket.types";

function TicketDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [ticket, setTicket] = useState<Ticket | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TicketPriority>("MEDIUM");
  const [category, setCategory] =
    useState<TicketCategory>("OTHER");
  const [status, setStatus] =
    useState<TicketStatus>("OPEN");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) {
        setError("Ticket ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await getTicketById(id);

        setTicket(data);
        setTitle(data.title);
        setDescription(data.description);
        setPriority(data.priority);
        setCategory(data.category);
        setStatus(data.status);
      } catch (error) {
        setError("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const updatedTicket = await updateTicket(id, {
        title,
        description,
        priority,
        category,
        status,
      });

      setTicket(updatedTicket);
      setMessage("Ticket updated successfully");
    } catch (error) {
      setError("Failed to update ticket");
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteTicket(id);

      navigate("/dashboard");
    } catch (error) {
      setError("Failed to delete ticket");
    }
  };

  if (loading) {
    return <p>Loading ticket...</p>;
  }

  if (error && !ticket) {
    return <p>{error}</p>;
  }

  if (!ticket) {
    return <p>Ticket not found</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <h1>Ticket Detail</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(
              event: ChangeEvent<HTMLInputElement>
            ) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            value={description}
            onChange={(
              event: ChangeEvent<HTMLTextAreaElement>
            ) => setDescription(event.target.value)}
          />
        </div>

        <div>
          <label>Priority</label>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value as TicketPriority
              )
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label>Category</label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as TicketCategory
              )
            }
          >
            <option value="TECHNICAL">Technical</option>
            <option value="ACCOUNT">Account</option>
            <option value="BILLING">Billing</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as TicketStatus
              )
            }
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">
              In Progress
            </option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {message && <p>{message}</p>}
        {error && <p>{error}</p>}

        <button type="submit">
          Update Ticket
        </button>

        <button
          type="button"
          onClick={handleDelete}
        >
          Delete Ticket
        </button>
      </form>
    </div>
  );
}

export default TicketDetail;