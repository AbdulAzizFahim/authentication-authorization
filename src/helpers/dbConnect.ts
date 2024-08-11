import mongoose, { mongo } from "mongoose";

const connectToMongoDb = async (): Promise<boolean> => {
  if (mongoose.connection.readyState != 0) {
    return true;
  }

  try {
    const database: mongoose.Mongoose = await mongoose.connect(process.env.MONGODB_URI!);
    return database.connection.readyState != 0;
  } catch (error) {
    console.log("Can not connect to mongoDb database", error);
    return false;
  }
};

export default connectToMongoDb;
