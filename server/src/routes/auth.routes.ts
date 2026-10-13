import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  protect,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req: AuthRequest, res) => {
  res.json({
    user: req.user,
  });
});

export default router;