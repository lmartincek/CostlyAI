import express from 'express';
const cookieParser = require('cookie-parser')

import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';

dotenv.config({ path: `.env.${process.env.NODE_ENV}`})

const app = express();

const allowedOrigins = [
    'https://costlyai-webclient.onrender.com',
    'http://localhost:4173',
    'http://localhost:5173',
];

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

app.use(cookieParser());
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.info(`Server running on: ${JSON.stringify(process.env.BASE_URL)}`)
});
