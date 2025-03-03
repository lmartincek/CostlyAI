import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// @ts-ignore
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';

//TODO later fix handling env files automatically
// dotenv.config({path: '.env.local'})
dotenv.config({path: '.env.production'})

const app = express();

// Enable CORS
app.use(
    cors({
        origin: 'http://localhost:5173', // Replace with your frontend URL
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
    console.info(`Server running on http://localhost:${PORT}`);
});
