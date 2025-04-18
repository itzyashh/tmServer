import { Router } from 'express';
import { userRouter } from './userRoutes.js';
import { taskRouter } from './taskRoutes.js';

const router = Router();

// Root route for the API
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the TM Server API',
        status: 'API is running',
        version: '1.0.0'
    });
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

router.use('/user', userRouter);
router.use('/tasks', taskRouter);
export { router };
