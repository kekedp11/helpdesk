import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicketById);
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

export default router;