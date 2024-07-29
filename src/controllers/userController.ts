import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator';
import { CustomRequest } from '../middlewares';

const prisma = new PrismaClient();

export const user = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        const error = new Error("There is no User")
        return next(error);
    }
    const username = req.user.username
    const users = await prisma.users.findUnique({
        where: {
            username
        }
    });
    // console.log('header', req.user)
    return res.status(200).json({ users })
}

export const createUser =
    [
        body('username').not().isEmpty().withMessage('Username cannot be Empty'),
        body('email').isEmail().withMessage('Please enter a valid email address'),
        body('isAuthor').isBoolean().withMessage('Please select if you are author or not'),
        body('password').not().isEmpty().withMessage('password cannot be Empty'),
        body('password').isLength({ min: 6 }).withMessage('The minimum password length is 6 characters'),

        async (req: Request, res: Response) => {
            const { username, password, email, isAuthor } = req.body;
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const existingUsername = await prisma.users.findUnique({
                    where: {
                        username,
                    }
                })
                const existingEmail = await prisma.users.findUnique({
                    where: {
                        email,
                    }
                })
                if (existingUsername) {
                    return res.status(400).json({ error: 'Username is already taken' });
                }

                if (existingEmail) {
                    return res.status(400).json({ error: 'Email is already in use' });
                }
                const hashed = await bcrypt.hash(password, 10)
                // console.log('hashed', hashed)
                const newUser = await prisma.users.create({
                    data: {
                        username,
                        password: hashed,
                        email,
                        isAuthor
                    }
                })
                return res.status(201).json(newUser);
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


export const loginUser = [
    body('username').not().isEmpty().withMessage('Username does not Empty'),
    body('password').not().isEmpty().withMessage('password does not Empty'),



    async (req: Request, res: Response, next: NextFunction) => {

        const { username, password } = req.body;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await prisma.users.findUnique({
            where: {
                username,
            }
        })
        try {
            if (user == null) {
                return res.status(500).json({ message: 'No username found' })
            }
            const hashed = user.password
            const passwordMatches = await bcrypt.compare(password, hashed)
            if (!passwordMatches) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            if (!process.env.JWT_SECRET) {
                const error = new Error("There is no JWT Secret Key")
                return next(error);
            }
            const token = jwt.sign(user, process.env.JWT_SECRET,) // use this later{ expiresIn: '10h' } 

            res.json({ token })


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