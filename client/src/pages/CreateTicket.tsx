import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../services/ticket.service";
import type {
  TicketPriority,
  TicketCategory,
} from "../types/ticket.types";

function CreateTicket() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TicketPriority>("MEDIUM");
  const [category, setCategory] =
    useState<TicketCategory>("OTHER");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setMessage("");
      setError("");

      await createTicket({
        title,
        description,
        priority,
        category,
      });

      setMessage("Ticket created successfully");

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setCategory("OTHER");
    } catch (error) {
      setError("Failed to create ticket");
    }
  };

  const handleTitleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
      
      <h1>Create Ticket</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
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

        {message && <p>{message}</p>}
        {error && <p>{error}</p>}

        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
}

export default CreateTicket;