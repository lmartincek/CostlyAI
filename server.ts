import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// @ts-ignore
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';

dotenv.config({ path: `.env.${process.env.NODE_ENV}`})

const app = express();

const allowedOrigins = [
    'https://costlyai-webclient.onrender.com',
    'http://localhost:4173',
    'http://localhost:5173',
];

// Enable CORS
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true,
    })
);

// Middleware
app.use(express.json());

// Use API routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.info(`Server running on: ${JSON.stringify(process.env.BASE_URL)}`)
});
