import express from "express";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  (req: AuthRequest, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);

router.get(
  "/tickets",
  protect,
  authorize("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const tickets = await Ticket.find()
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

      res.json({
        tickets,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

router.get(
  "/agents",
  protect,
  authorize("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const agents = await User.find({
        role: "AGENT",
      }).select("_id name email");

      res.json({
        agents,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

router.patch(
  "/tickets/:id",
  protect,
  authorize("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const ticketId = req.params.id;

      if (!ticketId || Array.isArray(ticketId)) {
        res.status(400).json({
          message: "Invalid ticket ID",
        });
        return;
      }

      const {
        title,
        description,
        status,
        priority,
        category,
      } = req.body;

      const validStatuses = [
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED",
      ];

      const validPriorities = [
        "LOW",
        "MEDIUM",
        "HIGH",
      ];

      const validCategories = [
        "TECHNICAL",
        "ACCOUNT",
        "BILLING",
        "OTHER",
      ];

      if (
        status !== undefined &&
        !validStatuses.includes(status)
      ) {
        res.status(400).json({
          message: "Invalid status",
        });
        return;
      }

      if (
        priority !== undefined &&
        !validPriorities.includes(priority)
      ) {
        res.status(400).json({
          message: "Invalid priority",
        });
        return;
      }

      if (
        category !== undefined &&
        !validCategories.includes(category)
      ) {
        res.status(400).json({
          message: "Invalid category",
        });
        return;
      }

      const ticket = await Ticket.findById(ticketId);

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

      if (status !== undefined) {
        ticket.status = status;
      }

      if (priority !== undefined) {
        ticket.priority = priority;
      }

      if (category !== undefined) {
        ticket.category = category;
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
  }
);

router.patch(
  "/tickets/:id/assign",
  protect,
  authorize("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const ticketId = req.params.id;
      const { agentId } = req.body;

      if (!ticketId || Array.isArray(ticketId)) {
        res.status(400).json({
          message: "Invalid ticket ID",
        });
        return;
      }

      if (!agentId) {
        res.status(400).json({
          message: "Agent ID is required",
        });
        return;
      }

      const agent = await User.findOne({
        _id: agentId,
        role: "AGENT",
      });

      if (!agent) {
        res.status(404).json({
          message: "Agent not found",
        });
        return;
      }

      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        res.status(404).json({
          message: "Ticket not found",
        });
        return;
      }

      ticket.assignedTo = agent._id;

      await ticket.save();

      res.json({
        message: "Ticket assigned successfully",
        ticket,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

export default router;