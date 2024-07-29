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
exports.createComment = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
exports.createComment = [
    (0, express_validator_1.body)('comment').not().isEmpty().withMessage('Comment cannot be Empty'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { comment } = req.body;
        const postId = parseInt(req.params.id, 10);
        const userInfo = req.token;
        // console.log('decoded', userInfo)
        const username = userInfo.username;
        const userId = userInfo.id;
        // console.log('username', username + ' ' + userId)
        try {
            const newComment = yield prisma.comment.create({
                data: {
                    content: comment,
                    userId,
                    postId
                }
            });
            res.status(200).json({ message: 'Token Authorized', newComment, username });
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
