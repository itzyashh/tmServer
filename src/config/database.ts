import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI ?? '');
        console.log('Connected to MongoDB successfully.');
    } catch (e) {
        console.error('Error connecting to mongoDB:', e);
        throw e;
    }
};

export { connectDB };
