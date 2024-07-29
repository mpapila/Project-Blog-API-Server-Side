import { PrismaClient } from '@prisma/client';
import express from 'express';
import { createUser, loginUser, user } from '../controllers/userController';
import { createPost, editPost, listPost, showPost } from '../controllers/postController';
import { verifyToken } from '../middlewares';
import { createComment } from '../controllers/commentController';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/users', verifyToken, user)
router.post('/user/new', createUser)
router.post('/user/login', loginUser)
router.get('/posts', listPost)
router.post('/posts/new', verifyToken, createPost)
router.get('/posts/:id', showPost)
router.put('/posts/:id', verifyToken, editPost)
router.post('/posts/:id/comment/new', verifyToken, createComment)


export default router;