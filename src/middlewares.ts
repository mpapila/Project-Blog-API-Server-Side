import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { users } from '@prisma/client'

export interface CustomRequest extends Request {
    token?: string | JwtPayload | DecodedToken;
    user?: users
}
export interface DecodedToken {
    [x: string]: any;
    _id: string
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    if (!process.env.JWT_SECRET) {
        return res.status(401).json({ errorMessage: 'There is no JWT Secret Key' });
    }
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ errorMessage: 'No token provided' });
    }
    const token = req.headers['authorization']?.split(' ')[1] || '';
    if (!token) {
        return res.status(401).json({ errorMessage: 'No token provided' })
    }

    // console.log('cookies', token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken
    (req as CustomRequest).token = decoded;
    (req as CustomRequest).user = decoded as unknown as users
    next();
}