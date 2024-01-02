import express from "express";
import * as GameController from "../controllers/gameRooms.controller";
import { requiresAuth } from "../middleware/auth.middleware";

const router = express.Router();



router.post("/:gameRoomId", requiresAuth, GameController.getGameRoomById);
router.get("/", requiresAuth, GameController.getUserRooms);

export default router;
