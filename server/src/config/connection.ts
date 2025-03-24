import mongoose from 'mongoose';

// Define the MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

const db = async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to database');
        return mongoose.connection;
    } catch (error) {
        console.log('Error connecting to database: ', error);
        throw new Error('Database connection failed');  
    }
};

export default db;