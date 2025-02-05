"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// @ts-ignore
const cors_1 = __importDefault(require("cors"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
}));
// Middleware
app.use(express_1.default.json());
// Use API routes
app.use('/api', apiRoutes_1.default);
// Start the server
const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
