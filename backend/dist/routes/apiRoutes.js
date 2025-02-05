"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const externalApiController_1 = require("../controllers/externalApiController");
const myApiController_1 = require("../controllers/myApiController");
const router = (0, express_1.Router)();
// @ts-ignore
router.post('/chat', externalApiController_1.getChatResponse);
router.get('/products', myApiController_1.getProducts);
router.get('/countries', myApiController_1.getCountries);
// todo how to register this one dynamic endpoint
router.get('/countries/:countryId/cities', myApiController_1.getCities);
exports.default = router;
