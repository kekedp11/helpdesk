import type { Response } from "express";
import Ticket from "../models/Ticket.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const createTicket = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, priority, category } = req.body;

    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    const validCategories = ["TECHNICAL", "ACCOUNT", "BILLING", "OTHER"];

    if (priority && !validPriorities.includes(priority)) {
      res.status(400).json({
        message: "Invalid priority",
      });
      return;
    }

    if (category && !validCategories.includes(category)) {
      res.status(400).json({
        message: "Invalid category",
      });
      return;
    }

    if (!title || !description) {
      res.status(400).json({
        message: "Title and description are required",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTickets = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const tickets = await Ticket.find({
      createdBy: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTicketById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const ticketId = req.params.id;

    if (!ticketId || Array.isArray(ticketId)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    const ticket = await Ticket.findOne({
      _id: ticketId,
      createdBy: req.user.userId,
    });

    if (!ticket) {
      res.status(404).json({
        message: "Ticket not found",
      });
      return;
    }

    res.json({
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateTicket = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const ticketId = req.params.id;

    if (!ticketId || Array.isArray(ticketId)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    const { title, description, priority, category, status } = req.body;

    const ticket = await Ticket.findOne({
      _id: ticketId,
      createdBy: req.user.userId,
    });

    if (!ticket) {
      res.status(404).json({
        message: "Ticket not found",
      });
      return;
    }

    if (title !== undefined) {
      ticket.title = title;
    }

    if (description !== undefined) {
      ticket.description = description;
    }

    if (priority !== undefined) {
      ticket.priority = priority;
    }

    if (category !== undefined) {
      ticket.category = category;
    }

    if (status !== undefined) {
      ticket.status = status;
    }

    await ticket.save();

    res.json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteTicket = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const ticketId = req.params.id;

    if (!ticketId || Array.isArray(ticketId)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    const ticket = await Ticket.findOneAndDelete({
      _id: ticketId,
      createdBy: req.user.userId,
    });

    if (!ticket) {
      res.status(404).json({
        message: "Ticket not found",
      });
      return;
    }

    res.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};