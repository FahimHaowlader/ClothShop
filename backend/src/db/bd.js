import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
        console.log(`Connected to database: ${connectionInstance.connection.host}`);
        console.log("Database connected successfully");

    }
    catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit the process with failure // *** it a node js command any non-zero exit  means errors and force quite and zero exit means successfull and force quite ,but we do not do this because if the database connected successfully then we do ot want force quite 
    }
}


export default connectDB;