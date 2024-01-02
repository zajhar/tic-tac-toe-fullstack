import { RequestHandler } from "express";
import GameRoomModel from "../models/gameRoom.model";
import UserModel from "../models/user.model";

export const getGameRoomById: RequestHandler = async (req, res, next) => {
  try {
    const roomId = req.params.gameRoomId;
    if (!roomId) {
      return res.status(300).send({ error: "No roomID specified!" });
    }
    const room = await GameRoomModel.findById(roomId);
    if (!room) {
      return res.status(404).send({ error: "Room not find!" });
    }
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

export const getUserRooms: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId).exec();

    const inactiveRooms = await GameRoomModel.find({
      $or: [{ player1: user }, { player2: user }],
      isActive: false,
    }).populate("player1 player2");

    return res.status(201).json(inactiveRooms);
  } catch (error) {
    next(error);
  }
};