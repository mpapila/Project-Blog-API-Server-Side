"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPost = exports.showPost = exports.createPost = exports.listPost = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const listPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPosts = yield prisma.posts.findMany({
            include: {
                user: true,
                comment: true,
            }
        });
        // console.log('posts', allPosts)
        res.status(200).json({ message: 'Token Authorized', allPosts });
    }
    catch (error) {
        if (error instanceof Error) {
            const payload = {
                errorMessage: error.message
            };
            return res.status(500).json(payload);
        }
        throw error;
    }
});
exports.listPost = listPost;
exports.createPost = [
    (0, express_validator_1.body)('title').not().isEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('content').not().isEmpty().withMessage('Post cannot be empty'),
    (0, express_validator_1.body)('isPublished').isBoolean().withMessage('Please choose your selection'),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const decoded = req.token;
        const userId = decoded.id;
        // console.log(userId);
        const { title, content, isPublished } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const newPost = yield prisma.posts.create({
                data: {
                    title,
                    content,
                    isPublished,
                    userId,
                }
            });
            return res.status(201).json(newPost);
        }
        catch (error) {
            if (error instanceof Error) {
                const payload = {
                    errorMessage: error.message
                };
                return res.status(500).json(payload);
            }
            throw error;
        }
    })
];
const showPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = parseInt(req.params.id, 10);
    const post = yield prisma.posts.findUnique({
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
    const commentsWithUsernames = yield Promise.all(post.comment.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
        const commentUser = yield prisma.users.findUnique({
            where: { id: comment.userId },
            select: { username: true }
        });
        return Object.assign(Object.assign({}, comment), { user: commentUser });
    })));
    const responsePayload = Object.assign(Object.assign({}, post), { comment: commentsWithUsernames });
    return res.status(200).json(responsePayload);
});
exports.showPost = showPost;
exports.editPost = [
    (0, express_validator_1.body)('title').not().isEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('content').not().isEmpty().withMessage('Post cannot be empty'),
    (0, express_validator_1.body)('isPublished').isBoolean().withMessage('Please choose your selection'),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = parseInt(req.params.id, 10);
        const { title, content, isPublished } = req.body;
        const user = req.user;
        try {
            const oldPost = yield prisma.posts.findUnique({
                where: {
                    id: postId
                }
            });
            if (!user) {
                const error = new Error("There is no User");
                return next(error);
            }
            if ((oldPost === null || oldPost === void 0 ? void 0 : oldPost.userId) !== user.id) {
                throw new Error('You do not own this post');
            }
            const editedPost = yield prisma.posts.update({
                where: {
                    id: postId,
                },
                data: {
                    title,
                    content,
                    isPublished,
                }
            });
            return res.status(200).json(editedPost);
        }
        catch (error) {
            if (error instanceof Error) {
                const payload = {
                    errorMessage: error.message
                };
                return res.status(500).json(payload);
            }
            throw error;
        }
    })
];
