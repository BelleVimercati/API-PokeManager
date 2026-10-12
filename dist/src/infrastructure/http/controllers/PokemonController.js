"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
class PokemonController {
    listPokemonUseCase;
    getPokemonByIdUseCase;
    createPokemonUseCase;
    updatePokemonUseCase;
    deletePokemonUseCase;
    constructor(listPokemonUseCase, getPokemonByIdUseCase, createPokemonUseCase, updatePokemonUseCase, deletePokemonUseCase) {
        this.listPokemonUseCase = listPokemonUseCase;
        this.getPokemonByIdUseCase = getPokemonByIdUseCase;
        this.createPokemonUseCase = createPokemonUseCase;
        this.updatePokemonUseCase = updatePokemonUseCase;
        this.deletePokemonUseCase = deletePokemonUseCase;
    }
    async list(req, res) {
        const type = typeof req.query.type === 'string' ? req.query.type : undefined;
        const pokemons = await this.listPokemonUseCase.execute({ type });
        const formattedPokemons = pokemons.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            type: pokemon.type,
        }));
        return res.status(200).json({ data: formattedPokemons });
    }
    async create(req, res) {
        const { name, type } = req.body;
        const pokemon = await this.createPokemonUseCase.execute({ name, type });
        return res.status(201).json({
            message: 'Pokemon created successfully',
            data: { name: pokemon.name, type: pokemon.type },
        });
    }
    async delete(req, res) {
        const { id } = req.params;
        await this.deletePokemonUseCase.execute(id);
        return res.status(200).json({ message: 'Pokemon deleted successfully' });
    }
    async update(req, res) {
        const { id } = req.params;
        const { name, type } = req.body;
        const updatedPokemon = await this.updatePokemonUseCase.execute({
            id,
            name,
            type,
        });
        return res.status(200).json({
            message: 'Pokemon updated successfully',
            data: { name: updatedPokemon.name, type: updatedPokemon.type },
        });
    }
    async getById(req, res) {
        const { id } = req.params;
        const pokemon = await this.getPokemonByIdUseCase.execute(id);
        return res.status(200).json({
            message: 'Pokemon retrieved successfully',
            data: { id: pokemon.id, name: pokemon.name, type: pokemon.type },
        });
    }
}
exports.PokemonController = PokemonController;
