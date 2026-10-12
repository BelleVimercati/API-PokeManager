"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const pokemons_routes_1 = require("../infrastructure/http/routes/pokemons.routes.js");
const trainers_routes_1 = require("../infrastructure/http/routes/trainers.routes.js");
const errorHandler_1 = require("../infrastructure/http/middlewares/errorHandler.js");
const openapiPath = node_path_1.default.join(__dirname, '../infrastructure/http/docs/openapi.json');
const openapiDocument = JSON.parse((0, node_fs_1.readFileSync)(openapiPath, 'utf-8'));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiDocument));
app.use('/api/v1/pokemons', pokemons_routes_1.pokemonRoutes);
app.use('/api/v1/trainers', trainers_routes_1.trainerRoutes);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
app.listen(PORT, () => {
    console.log(`PokéManager API rodando em http://localhost:${PORT}`);
});
