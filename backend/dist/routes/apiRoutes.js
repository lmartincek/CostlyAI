"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const externalApiController_1 = require("../controllers/externalApiController");
const router = (0, express_1.Router)();
// @ts-ignore
router.post('/chat', externalApiController_1.getChatResponse); // Define a route to fetch data from the external API via the backend
exports.default = router;
