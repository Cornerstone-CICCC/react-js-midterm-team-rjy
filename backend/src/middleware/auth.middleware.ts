import { Request, Response, NextFunction } from "express";

export const authLogin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session ||!req.session.isLoggedIn) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

export const authLogout = (req: Request, res: Response, next: NextFunction) => {
    if(req.session && req.session.isLoggedIn) {
        return res.status(400).json({ message: "Already logged in" });
    }
    next();
}