import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'
import { CustomRequest, DecodedToken } from '../middlewares';
import { body, validationResult } from 'express-validator';
const prisma = new PrismaClient();

export const createComment = [
    body('comment').not().isEmpty().withMessage('Comment cannot be Empty'),

    async (req: Request, res: Response) => {
        const { comment } = req.body;
        const postId = parseInt(req.params.id, 10)
        const userInfo = (req as CustomRequest).token as DecodedToken;

        // console.log('decoded', userInfo)
        const username = userInfo.username
        const userId = userInfo.id
        // console.log('username', username + ' ' + userId)
        try {
            const newComment = await prisma.comment.create({
                data: {
                    content: comment,
                    userId,
                    postId
                }
            })
            res.status(200).json({ message: 'Token Authorized', newComment, username })
        } catch (error) {
            if (error instanceof Error) {
                const payload = {
                    errorMessage: error.message
                }
                return res.status(500).json(payload)
            }
            throw error
        }
    }
]