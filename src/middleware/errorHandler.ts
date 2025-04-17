import { Request, Response, NextFunction } from 'express';

// Error interface
interface AppError extends Error {
    statusCode?: number;
    errors?: any;
}

/**
 * Global error handler middleware
 */
const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode ?? 500;

    // Create response object
    const response = {
        error: {
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                details: err.errors
            })
        }
    };

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR:', err);
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
