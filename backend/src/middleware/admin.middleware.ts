import { Request, Response, NextFunction } from 'express'

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if(!req.user || req.user.role !== 'admin'){
    return res.status(403).json({
      message: "You are not allowed to access this!",
    })
  }
  next()
}