import { Request, Response, NextFunction } from "express";
import { Role } from "../types/role";

export const attachUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId, userRole } = req.session
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  req.user = {
    id: userId,
    role: userRole as Role,
  }
  next();
}