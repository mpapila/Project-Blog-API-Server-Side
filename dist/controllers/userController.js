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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = exports.user = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        const error = new Error("There is no User");
        return next(error);
    }
    const username = req.user.username;
    const users = yield prisma.users.findUnique({
        where: {
            username
        }
    });
    // console.log('header', req.user)
    return res.status(200).json({ users });
});
exports.user = user;
exports.createUser = [
    (0, express_validator_1.body)('username').not().isEmpty().withMessage('Username cannot be Empty'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address'),
    (0, express_validator_1.body)('isAuthor').isBoolean().withMessage('Please select if you are author or not'),
    (0, express_validator_1.body)('password').not().isEmpty().withMessage('password cannot be Empty'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('The minimum password length is 6 characters'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password, email, isAuthor } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const existingUsername = yield prisma.users.findUnique({
                where: {
                    username,
                }
            });
            const existingEmail = yield prisma.users.findUnique({
                where: {
                    email,
                }
            });
            if (existingUsername) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
            if (existingEmail) {
                return res.status(400).json({ error: 'Email is already in use' });
            }
            const hashed = yield bcrypt_1.default.hash(password, 10);
            // console.log('hashed', hashed)
            const newUser = yield prisma.users.create({
                data: {
                    username,
                    password: hashed,
                    email,
                    isAuthor
                }
            });
            return res.status(201).json(newUser);
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
exports.loginUser = [
    (0, express_validator_1.body)('username').not().isEmpty().withMessage('Username does not Empty'),
    (0, express_validator_1.body)('password').not().isEmpty().withMessage('password does not Empty'),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = yield prisma.users.findUnique({
            where: {
                username,
            }
        });
        try {
            if (user == null) {
                return res.status(500).json({ message: 'No username found' });
            }
            const hashed = user.password;
            const passwordMatches = yield bcrypt_1.default.compare(password, hashed);
            if (!passwordMatches) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            if (!process.env.JWT_SECRET) {
                const error = new Error("There is no JWT Secret Key");
                return next(error);
            }
            const token = jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET); // use this later{ expiresIn: '10h' } 
            res.json({ token });
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
