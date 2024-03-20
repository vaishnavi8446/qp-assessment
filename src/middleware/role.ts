import { Request as ExpressRequest, Response, NextFunction } from 'express';
import User from '../models/User';

interface RequestWithUser extends ExpressRequest {
  user?: User; 
}

export const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: You must be an admin to access this resource' });
  }
  next(); 
};
