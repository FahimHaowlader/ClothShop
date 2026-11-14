import 'dotenv/config';
import mongoose from 'mongoose';
import connectMongoDB from './db/MongoDB.js'; // Import the MongoDB connection function
import app from './app.js';       // your Express app

import { startOrderCleanupWorker } from "./controllers/Helper.controller.js";

const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      startOrderCleanupWorker();
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();