"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresAuth = void 0;
const requiresAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    }
    else {
        next(res.status(401).send({ error: "User not authenticated" }));
    }
};
exports.requiresAuth = requiresAuth;
