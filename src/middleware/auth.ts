// auth middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Status } from '../common/status';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ status: Status.ERROR, message: 'Unauthorized access' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '');
        req.body.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: Status.ERROR, message: 'Unauthorized access' });
    }
};