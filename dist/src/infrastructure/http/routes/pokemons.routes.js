"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonRoutes = void 0;
const express_1 = require("express");
const makePokemonController_factory_1 = require("../../../main/factories/makePokemonController.factory.js");
const pokemonController = (0, makePokemonController_factory_1.makePokemonController)();
const router = (0, express_1.Router)();
exports.pokemonRoutes = router;
router.get('/', (req, res) => pokemonController.list(req, res));
router.post('/', (req, res) => pokemonController.create(req, res));
// Rotas fixas precisam vir antes de '/:id', senão "search" e "count" viram um id
router.get('/search', (req, res) => pokemonController.search(req, res));
router.get('/count', (req, res) => pokemonController.count(req, res));
router.get('/:id', (req, res) => pokemonController.getById(req, res));
router.put('/:id', (req, res) => pokemonController.update(req, res));
router.delete('/:id', (req, res) => pokemonController.delete(req, res));
router.patch('/:id/level', (req, res) => pokemonController.updateLevel(req, res));
