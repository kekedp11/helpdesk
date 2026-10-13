import express from "express";
import Ticket from "../models/Ticket.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/tickets",
  protect,
  authorize("AGENT"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Not authorized",
        });
        return;
      }

      const tickets = await Ticket.find({
        assignedTo: req.user.userId,
      }).sort({ createdAt: -1 });

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

router.patch(
  "/tickets/:id",
  protect,
  authorize("AGENT"),
  async (req: AuthRequest, res) => {
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

      const { status } = req.body;

      const validStatuses = [
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED",
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

      const ticket = await Ticket.findOne({
        _id: ticketId,
        assignedTo: req.user.userId,
      });

      if (!ticket) {
        res.status(404).json({
          message: "Ticket not found or not assigned to you",
        });
        return;
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
  }
);

export default router;