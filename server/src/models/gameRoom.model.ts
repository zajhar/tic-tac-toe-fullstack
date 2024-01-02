import { InferSchemaType, model, Schema, HydratedDocument } from "mongoose";

const gameRoomSchema = new Schema({
  player1: { type: Schema.Types.ObjectId, ref: "User" },
  player2: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: () => Date.now() },
  endedAt: { type: Date },
  board: [
    [String, String, String, String, String, String, String, String, String],
  ],
  isActive: { type: Boolean, default: true },
  lastMove: { type: String },
});

export type GameRoom = HydratedDocument<InferSchemaType<typeof gameRoomSchema>>;

export default model<GameRoom>("GameRoom", gameRoomSchema);
