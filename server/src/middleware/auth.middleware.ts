import { RequestHandler } from "express";

export const requiresAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    next(res.status(401).send({ error: "User not authenticated" }));
  }
};
