import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  points: { type: Number, required: false, default: 0 },
  createdAt: { type: Date, default: () => Date.now() },
});

export type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
