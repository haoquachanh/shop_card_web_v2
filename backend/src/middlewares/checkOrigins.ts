import { NextFunction, Request, Response } from 'express';

const allowedOrigins = [process.env.CLIENT_URL, process.env.HOST_URL, process.env.HOST_URL2, process.env.MANAGER_URL, process.env.MAIN_URL];

export const checkOrigin = (req: Request, res: Response, next : NextFunction) => {
    if (!req.get('origin') || allowedOrigins.indexOf(req.get('origin')) === -1) {
      // Nếu không có nguồn gốc hoặc không hợp lệ, từ chối yêu cầu
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
  