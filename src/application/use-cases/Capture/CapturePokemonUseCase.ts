import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';

const MAX_TEAM_SIZE = 6;

interface CapturePokemonDTO {
  trainerId: number;
  // id (UUID) de um Pokémon já cadastrado em /pokemons
  pokemonId: string;
}

export class CapturePokemonUseCase {
  constructor(
    private readonly pokemonRepository: IPokemonRepository,
    private readonly trainerRepository: IPgTrainerRepository,
  ) {}

  async execute({ trainerId, pokemonId }: CapturePokemonDTO): Promise<Pokemon> {
    // 1. Treinador existe?
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) throw new NotFoundError('Treinador');

    // 2. Pokémon existe? (os dados da PokéAPI já foram salvos no cadastro)
    const pokemon = await this.pokemonRepository.findById(pokemonId);
    if (!pokemon) throw new NotFoundError('Pokémon');

    // 3. Pokémon já pertence a algum treinador?
    if (pokemon.trainerId != null) {
      throw new ConflictError(
        pokemon.trainerId === trainerId
          ? 'Este Pokémon já está no time deste treinador'
          : 'Este Pokémon já foi capturado por outro treinador',
      );
    }

    // 4. Regra de negócio: no máximo 6 no time
    const teamSize = await this.pokemonRepository.countByTrainerId(trainerId);
    if (teamSize >= MAX_TEAM_SIZE) {
      throw new ConflictError(
        `O treinador já possui ${MAX_TEAM_SIZE} Pokémons no time`,
      );
    }

    // 5. Associa ao treinador
    pokemon.setTrainerId(trainerId);
    await this.pokemonRepository.update(pokemon);
    return pokemon;
  }
}
