import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

type UserRole = "USER" | "AGENT" | "ADMIN";

interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Token is missing",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};