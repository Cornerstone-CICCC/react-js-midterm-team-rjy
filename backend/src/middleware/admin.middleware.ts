import { Request, Response, NextFunction } from 'express'
import { Role } from '../types/role'

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if(!req.user || req.user.role !== Role.ADMIN){
    return res.status(403).json({
      message: "You are not allowed to access this!",
    })
  }
  next()
}