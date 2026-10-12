"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePokemonController = makePokemonController;
const pgPokemon_repository_1 = require("../../infrastructure/database/postgres/pgPokemon.repository.js");
const ListPokemonUseCase_1 = require("../../application/use-cases/ListPokemonUseCase.js");
const GetPokemonByIdUseCase_1 = require("../../application/use-cases/GetPokemonByIdUseCase.js");
const CreatePokemonUseCase_1 = require("../../application/use-cases/CreatePokemonUseCase.js");
const UpdatePokemonUseCase_1 = require("../../application/use-cases/UpdatePokemonUseCase.js");
const DeletePokemonUseCase_1 = require("../../application/use-cases/DeletePokemonUseCase.js");
const PokemonController_1 = require("../../infrastructure/http/controllers/PokemonController.js");
const UpdatePokemonLevelUseCase_1 = require("../../application/use-cases/UpdatePokemonLevelUseCase.js");
const CountPokemonUseCase_1 = require("../../application/use-cases/CountPokemonUseCase.js");
const SearchPokemonByNameUseCase_1 = require("../../application/use-cases/SearchPokemonByNameUseCase.js");
const repository = new pgPokemon_repository_1.PgPokemonRepository();
function makePokemonController() {
    const listPokemonUseCase = new ListPokemonUseCase_1.ListPokemonUseCase(repository);
    const updatePokemonLevelUseCase = new UpdatePokemonLevelUseCase_1.UpdatePokemonLevelUseCase(repository);
    const getPokemonByIdUseCase = new GetPokemonByIdUseCase_1.GetPokemonByIdUseCase(repository);
    const createPokemonUseCase = new CreatePokemonUseCase_1.CreatePokemonUseCase(repository);
    const updatePokemonUseCase = new UpdatePokemonUseCase_1.UpdatePokemonUseCase(repository);
    const deletePokemonUseCase = new DeletePokemonUseCase_1.DeletePokemonUseCase(repository);
    const countPokemonUseCase = new CountPokemonUseCase_1.CountPokemonUseCase(repository);
    const searchPokemonByNameUseCase = new SearchPokemonByNameUseCase_1.SearchPokemonByNameUseCase(repository);
    return new PokemonController_1.PokemonController(listPokemonUseCase, getPokemonByIdUseCase, createPokemonUseCase, updatePokemonUseCase, deletePokemonUseCase, updatePokemonLevelUseCase, countPokemonUseCase, searchPokemonByNameUseCase);
}
