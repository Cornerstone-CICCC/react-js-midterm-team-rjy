import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const attachUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) return next();

  if (!req.user) {
    const user = await User.findById(req.session.userId).select("role");
    if (user) {
      req.user = { id: user._id.toString(), role: user.role };
    }
  }
  next();
}