import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
export function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}
export function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}
export function generateToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}
export function verifyToken(token) {
    try {
        return jwt.verify(token, config.jwtSecret);
    }
    catch {
        return null;
    }
}
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'Authentication required. Please log in.',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired authentication token. Please log in again.',
        });
        return;
    }
    req.user = payload;
    next();
}
export function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);
        if (payload) {
            req.user = payload;
        }
    }
    next();
}
export function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required.',
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: `Forbidden. This action requires one of the following roles: ${allowedRoles.join(', ')}.`,
            });
            return;
        }
        next();
    };
}
