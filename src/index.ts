import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/database.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World! This is the API endpoint.');
});

connectDB().then(() =>
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log('Press Ctrl+C to stop the server.');
    })
);
