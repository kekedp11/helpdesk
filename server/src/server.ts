import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import agentRoutes from "./routes/agent.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "HelpDesk API is running",
  });
});

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();