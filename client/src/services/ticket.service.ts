import api from "./api";
import type { Ticket } from "../types/ticket.types";

interface GetTicketsResponse {
  tickets: Ticket[];
}

interface GetTicketResponse {
  ticket: Ticket;
}

export const getTickets = async (): Promise<Ticket[]> => {
  const response = await api.get<GetTicketsResponse>("/tickets");

  return response.data.tickets;
};

export const getTicketById = async (
  id: string
): Promise<Ticket> => {
  const response = await api.get<GetTicketResponse>(
    `/tickets/${id}`
  );

  return response.data.ticket;
};

interface CreateTicketData {
  title: string;
  description: string;
  priority?: Ticket["priority"];
  category?: Ticket["category"];
}

interface CreateTicketResponse {
  message: string;
  ticket: Ticket;
}

export const createTicket = async (
  data: CreateTicketData
): Promise<Ticket> => {
  const response = await api.post<CreateTicketResponse>(
    "/tickets",
    data
  );

  return response.data.ticket;
};

interface UpdateTicketData {
  title?: string;
  description?: string;
  priority?: Ticket["priority"];
  category?: Ticket["category"];
  status?: Ticket["status"];
}

interface UpdateTicketResponse {
  message: string;
  ticket: Ticket;
}

export const updateTicket = async (
  id: string,
  data: UpdateTicketData
): Promise<Ticket> => {
  const response = await api.put<UpdateTicketResponse>(
    `/tickets/${id}`,
    data
  );

  return response.data.ticket;
};

interface DeleteTicketResponse {
  message: string;
}

export const deleteTicket = async (
  id: string
): Promise<string> => {
  const response = await api.delete<DeleteTicketResponse>(
    `/tickets/${id}`
  );

  return response.data.message;
};

interface AgentTicketsResponse {
  tickets: Ticket[];
}

export const getAgentTickets = async (): Promise<Ticket[]> => {
  const response = await api.get<AgentTicketsResponse>(
    "/agent/tickets"
  );

  return response.data.tickets;
};

export const updateAgentTicket = async (
  id: string,
  status: Ticket["status"]
): Promise<Ticket> => {
  const response = await api.patch<UpdateTicketResponse>(
    `/agent/tickets/${id}`,
    { status }
  );

  return response.data.ticket;
};

interface AdminTicketsResponse {
  tickets: Ticket[];
}

export const getAdminTickets = async (): Promise<Ticket[]> => {
  const response = await api.get<AdminTicketsResponse>(
    "/admin/tickets"
  );

  return response.data.tickets;
};

export const updateAdminTicket = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: Ticket["status"];
    priority?: Ticket["priority"];
    category?: Ticket["category"];
  }
): Promise<Ticket> => {
  const response = await api.patch<UpdateTicketResponse>(
    `/admin/tickets/${id}`,
    data
  );

  return response.data.ticket;
};

export const assignTicketToAgent = async (
  id: string,
  agentId: string
): Promise<Ticket> => {
  const response = await api.patch<UpdateTicketResponse>(
    `/admin/tickets/${id}/assign`,
    { agentId }
  );

  return response.data.ticket;
};

export interface Agent {
  _id: string;
  name: string;
  email: string;
}

interface AdminAgentsResponse {
  agents: Agent[];
}

export const getAdminAgents = async (): Promise<Agent[]> => {
  const response = await api.get<AdminAgentsResponse>(
    "/admin/agents"
  );

  return response.data.agents;
};