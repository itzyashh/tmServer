import { z } from 'zod';
import { Task, TaskPriority, TaskStatus } from '../models/Task.js';
import { Request, Response } from 'express';

const createTaskSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    status: z.enum([TaskStatus.ARCHIVED, TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS]).optional(),
    priority: z.enum([TaskPriority.HIGH, TaskPriority.LOW, TaskPriority.MEDIUM]).optional(),
    dueDate: z.string().datetime().optional()
});

const updateTaskSchema = createTaskSchema.partial();

export const getTasks = async (req: Request, res: Response): Promise<any> => {
    try {
        const offset = parseInt(req.query.offset as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as TaskStatus | undefined;
        const priority = req.query.priority as TaskPriority | undefined;

        const query: any = { userId: req.body.userId };
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tasks = await Task.find({ user: query.userId })
            .skip((offset - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ error: { message: 'Error fetching tasks' } });
    }
};
// Get a single task
export const getTask = async (req: Request, res: Response): Promise<any> => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.body.userId
        });

        if (!task) {
            return res.status(404).json({ error: { message: 'Task not found' } });
        }

        return res.status(200).json({ task });
    } catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({ error: { message: 'Error fetching task' } });
    }
};

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedData = createTaskSchema.parse(req.body);

        const task = await Task.create({
            ...validatedData,
            user: req.body.userId
        });

        return res.status(201).json({
            message: 'Task created successfully',
            task
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
        console.error('Error creating task:', error);
        return res.status(500).json({ error: { message: 'Error creating task' } });
    }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<any> => {
    try {
        const validatedData = updateTaskSchema.parse(req.body);

        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.body.userId }, validatedData, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).json({ error: { message: 'Task not found' } });
        }

        return res.status(200).json({
            message: 'Task updated successfully',
            task
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
        console.error('Error updating task:', error);
        return res.status(500).json({ error: { message: 'Error updating task' } });
    }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<any> => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.body.userId
        });

        if (!task) {
            return res.status(404).json({ error: { message: 'Task not found' } });
        }

        return res.status(200).json({
            message: 'Task deleted successfully',
            id: req.params.id
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ error: { message: 'Error deleting task' } });
    }
};
