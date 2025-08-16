import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async (): Promise<void> => {
    const mongoUrl = process.env.MONGODB_URI;
    
    // Validate MONGODB_URI
    if (!mongoUrl) {
        console.error('MONGODB_URI is not defined in .env file');
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', (error as any).message);
        throw error; // Rethrow to allow caller to handle
    }
};

export default connectDB;