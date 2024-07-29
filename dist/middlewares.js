"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    var _a;
    if (!process.env.JWT_SECRET) {
        return res.status(401).json({ errorMessage: 'There is no JWT Secret Key' });
    }
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ errorMessage: 'No token provided' });
    }
    const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
    if (!token) {
        return res.status(401).json({ errorMessage: 'No token provided' });
    }
    // console.log('cookies', token)
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    req.token = decoded;
    req.user = decoded;
    next();
}
