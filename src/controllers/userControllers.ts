import { z } from 'zod';
import { User } from '../models/User.js';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

const loginSchema = z
    .object({
        usernameOrEmail: z.string().optional(),
        password: z.string()
    })
    .refine((data) => data.usernameOrEmail, {
        message: 'Either username or email must be provided',
        path: ['usernameOrEmail']
    });

const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const existingUser = await User.findOne({
            $or: [{ email: validatedData.email }, { username: validatedData.username }]
        });
        if (existingUser) return res.status(401).json({ error: { message: 'User already exists' } });
        const hashedPassword = await bcrypt.hash(validatedData.password, 3);
        const newUser = await User.create({ ...validatedData, password: hashedPassword });
        const token = await generateToken(newUser);
        return res.status(201).json({
            message: 'User created!',
            user: {
                ...newUser.toObject(),
                token,
                password: undefined // Exclude password from the response
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: {
                    message: 'Validation error',
                    details: error.errors
                }
            });
        }
        return res.json({ error: { message: 'Something went wrong' } });
    }
};

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await User.findOne({
            $or: [{ email: validatedData.usernameOrEmail }, { username: validatedData.usernameOrEmail }]
        }).select('+password'); // Include password in the query to compare later
        if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });
        const isMatch = await bcrypt.compare(validatedData.password, user.password);
        if (!isMatch) return res.status(401).json({ error: { message: 'Invalid credentials' } });
        const token = await generateToken(user);

        return res.status(200).json({
            message: 'Login successful',
            user: {
                ...user.toObject(),
                token,
                password: undefined // Exclude password from the response
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: {
                    message: 'Validation error',
                    details: error.errors
                }
            });
        }
        console.error('Error during login:', error);
        return res.json({ error: { message: 'Something went wrong' } });
    }
};

export { register, login };
