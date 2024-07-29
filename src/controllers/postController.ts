import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { CustomRequest, DecodedToken } from '../middlewares';
import { body, validationResult } from 'express-validator';
const prisma = new PrismaClient();



export const listPost = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const allPosts = await prisma.posts.findMany({
            include: {
                user: true,
                comment: true,
            }
        })

        // console.log('posts', allPosts)
        res.status(200).json({ message: 'Token Authorized', allPosts })

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

export const createPost = [
    body('title').not().isEmpty().withMessage('Title cannot be empty'),
    body('content').not().isEmpty().withMessage('Post cannot be empty'),
    body('isPublished').isBoolean().withMessage('Please choose your selection'),

    async (req: Request, res: Response, next: NextFunction) => {
        const decoded = (req as CustomRequest).token as DecodedToken;
        const userId = decoded.id
        // console.log(userId);

        const { title, content, isPublished } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const newPost = await prisma.posts.create({
                data: {
                    title,
                    content,
                    isPublished,
                    userId,
                }
            })
            return res.status(201).json(newPost)
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
export const showPost = async (req: Request, res: Response) => {
    const postId = parseInt(req.params.id, 10);
    const post = await prisma.posts.findUnique({
        where: { id: postId },
        include: {
            user: {
                select: {
                    username: true,
                    email: true
                }
            },
            comment: true
        }
    });
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const commentsWithUsernames = await Promise.all(
        post.comment.map(async (comment) => {
            const commentUser = await prisma.users.findUnique({
                where: { id: comment.userId },
                select: { username: true }
            });
            return {
                ...comment,
                user: commentUser
            };
        })
    );
    const responsePayload = {
        ...post,
        comment: commentsWithUsernames
    }
    return res.status(200).json(responsePayload)
}
export const editPost = [
    body('title').not().isEmpty().withMessage('Title cannot be empty'),
    body('content').not().isEmpty().withMessage('Post cannot be empty'),
    body('isPublished').isBoolean().withMessage('Please choose your selection'),
    async (req: Request, res: Response, next: NextFunction) => {
        const postId = parseInt(req.params.id, 10);
        const { title, content, isPublished } = req.body
        const user = (req as CustomRequest).user

        try {
            const oldPost = await prisma.posts.findUnique({
                where: {
                    id: postId
                }
            })
            if (!user) {
                const error = new Error("There is no User")
                return next(error);
            }
            if (oldPost?.userId !== user.id) {
                throw new Error('You do not own this post')
            }
            const editedPost = await prisma.posts.update({
                where: {
                    id: postId,
                },
                data: {
                    title,
                    content,
                    isPublished,
                }
            })
            return res.status(200).json(editedPost)
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