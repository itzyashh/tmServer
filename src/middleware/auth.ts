import { error } from 'console';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User.js';

type AuthRequest = Request & {
    user: any;
};

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: { message: 'Invalid Token' } });
        const decoded = jwt.verify(token, process.env.JWT!);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: { message: 'Token verification failed' } });
    }
};
