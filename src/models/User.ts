import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    isAdmin?: boolean;
}

const userSchema = new mongoose.Schema(
    {
        username: {
            required: [true, 'Username is required'],
            minlength: [3, 'Username must be at least 3 characters long'],
            unique: true,
            type: String,
            trim: true,
            lowercase: true
        },
        email: {
            required: [true, 'Email is required'],
            unique: true,
            type: String,
            trim: true,
            lowercase: true
        },
        password: {
            required: true,
            type: String,
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false,
            trim: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

export const User = mongoose.model<IUser>('User', userSchema);
