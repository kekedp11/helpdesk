export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type TicketCategory =
  | "TECHNICAL"
  | "ACCOUNT"
  | "BILLING"
  | "OTHER";

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}