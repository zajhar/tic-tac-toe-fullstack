import { connect, set } from "mongoose";

// let mongod = null;

const connectDB = async () => {
  try {
    set("strictQuery", false); // DeprecationWarning
    const mongoURI: string = process.env.MONGO_URL || "";
    await connect(mongoURI);
    console.log("🔥 MongoDB connected!");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
