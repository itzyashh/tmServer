import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/database.js';

import errorHandler from './middleware/errorHandler.js';
import { router } from './routes/index.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/', router);
app.use(errorHandler);

connectDB().then(() =>
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log('Press Ctrl+C to stop the server.');
    })
);
