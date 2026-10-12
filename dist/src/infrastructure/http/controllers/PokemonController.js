"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
class PokemonController {
    listPokemonUseCase;
    getPokemonByIdUseCase;
    createPokemonUseCase;
    updatePokemonUseCase;
    deletePokemonUseCase;
    updatePokemonLevelUseCase;
    countPokemonUseCase;
    searchPokemonByNameUseCase;
    constructor(listPokemonUseCase, getPokemonByIdUseCase, createPokemonUseCase, updatePokemonUseCase, deletePokemonUseCase, updatePokemonLevelUseCase, countPokemonUseCase, searchPokemonByNameUseCase) {
        this.listPokemonUseCase = listPokemonUseCase;
        this.getPokemonByIdUseCase = getPokemonByIdUseCase;
        this.createPokemonUseCase = createPokemonUseCase;
        this.updatePokemonUseCase = updatePokemonUseCase;
        this.deletePokemonUseCase = deletePokemonUseCase;
        this.updatePokemonLevelUseCase = updatePokemonLevelUseCase;
        this.countPokemonUseCase = countPokemonUseCase;
        this.searchPokemonByNameUseCase = searchPokemonByNameUseCase;
    }
    async count(_req, res) {
        const total = await this.countPokemonUseCase.execute();
        return res.status(200).json({ total });
    }
    async list(req, res) {
        const type = typeof req.query.type === 'string' ? req.query.type : undefined;
        const pokemons = await this.listPokemonUseCase.execute({ type });
        const formattedPokemons = pokemons.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            type: pokemon.type,
            level: pokemon.level,
        }));
        return res.status(200).json({ data: formattedPokemons });
    }
    async create(req, res) {
        const { name, type, level } = req.body;
        const pokemon = await this.createPokemonUseCase.execute({
            name,
            type,
            level,
        });
        return res.status(201).json({
            message: 'Pokemon created successfully',
            data: {
                id: pokemon.id,
                name: pokemon.name,
                type: pokemon.type,
                level: pokemon.level,
            },
        });
    }
    async delete(req, res) {
        const { id } = req.params;
        await this.deletePokemonUseCase.execute(id);
        return res.status(200).json({ message: 'Pokemon deleted successfully' });
    }
    async update(req, res) {
        const { id } = req.params;
        const { name, type, level } = req.body;
        const updatedPokemon = await this.updatePokemonUseCase.execute({
            id,
            name,
            type,
            level,
        });
        return res.status(200).json({
            message: 'Pokemon updated successfully',
            data: {
                id: updatedPokemon.id,
                name: updatedPokemon.name,
                type: updatedPokemon.type,
                level: updatedPokemon.level,
            },
        });
    }
    async getById(req, res) {
        const { id } = req.params;
        const pokemon = await this.getPokemonByIdUseCase.execute(id);
        return res.status(200).json({
            message: 'Pokemon retrieved successfully',
            data: {
                id: pokemon.id,
                name: pokemon.name,
                type: pokemon.type,
                level: pokemon.level,
            },
        });
    }
    async updateLevel(req, res) {
        await this.updatePokemonLevelUseCase.execute(req.params.id, req.body.level);
        return res
            .status(200)
            .json({ message: 'Pokemon level updated successfully' });
    }
    async search(req, res) {
        const term = typeof req.query.name === 'string' ? req.query.name : '';
        const pokemons = await this.searchPokemonByNameUseCase.execute(term);
        return res.status(200).json({
            data: pokemons.map((p) => ({
                id: p.id,
                name: p.name,
                type: p.type,
                level: p.level,
            })),
        });
    }
}
exports.PokemonController = PokemonController;
