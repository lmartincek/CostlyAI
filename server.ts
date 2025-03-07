import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// @ts-ignore
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';

dotenv.config({ path: `.env.${process.env.NODE_ENV}`})

const app = express();

// Enable CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: 'GET,POST',
        allowedHeaders: 'Content-Type,Authorization',
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
