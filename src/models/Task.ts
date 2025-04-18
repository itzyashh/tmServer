import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export enum TaskStatus {
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
    ARCHIVED = 'archived'
}

export type ITask = {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
} & mongoose.Document;

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxlength: 50
        },
        description: {
            type: String,
            maxlength: 500,
            trim: true
        },
        status: {
            type: String,
            enum: Object.values(TaskStatus),
            default: null
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            default: TaskPriority.LOW
        },
        dueDate: {
            type: Date
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

taskSchema.plugin(mongoosePaginate);

export const Task = mongoose.model<ITask>('Task', taskSchema);
