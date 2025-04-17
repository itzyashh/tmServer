import { IUser } from '../models/User.js';
import jwt from 'jsonwebtoken';

export const generateToken = async (user: IUser) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username
        },
        process.env.JWT! as string,
        { expiresIn: parseInt(process.env.JWT_EXPIRE!, 10) || 3600 }
    ); // Default to 3600 seconds if JWT_EXPIRE is undefined
};
