import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_ATLAS_URI;

export async function connect() {
  const connectionState = mongoose.connection.readyState;

  if (connectionState == 1) {
    console.log("Already connected :)");
    return;
  }

  if (connectionState == 2) {
    console.log("Connecting...");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI, {
      dbName: "sample",
      bufferCommands: true,
    });
    console.log("Connected :)");
  } catch (error) {
    console.log("Error :(", err);
    throw new Error("Error", err);
    // process.exit(1);
  }
}
