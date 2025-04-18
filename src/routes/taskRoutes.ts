import { Router } from 'express';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/taskController.js';

export const taskRouter = Router();

taskRouter.get('', getTasks);
taskRouter.get('/:id', getTask);
taskRouter.post('/create', createTask);
taskRouter.put('/update/:id', updateTask);
taskRouter.delete('/delete/:id', deleteTask);
