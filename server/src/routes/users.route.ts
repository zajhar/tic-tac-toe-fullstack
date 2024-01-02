import express from "express";
import * as UserController from "../controllers/users.controller";
import { requiresAuth } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

export default router;
