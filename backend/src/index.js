import 'dotenv/config';
import mongoose from 'mongoose';
import connectMongoDB from './db/MongoDB.js'; // Import the MongoDB connection function
import app from './app.js';        // your Express app


await connectMongoDB(); // Connect to MongoDB before starting the server

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});