import { randomUUID } from 'node:crypto';
import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { IPokeApiGateway } from '@domain/gateways/IPokeApiGateway';
import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';

export const MAX_TEAM_SIZE = 6;

const TEAM_FULL_MESSAGE = `O treinador já possui ${MAX_TEAM_SIZE} Pokémons no time`;

interface CapturePokemonDTO {
  trainerId: number;
  pokemonName: string;
}

export class CapturePokemonUseCase {
  constructor(
    private readonly pokemonRepository: IPokemonRepository,
    private readonly trainerRepository: IPgTrainerRepository,
    private readonly pokeApiGateway: IPokeApiGateway,
  ) {}

  async execute({
    trainerId,
    pokemonName,
  }: CapturePokemonDTO): Promise<Pokemon> {
    // 1. Treinador existe?
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) throw new NotFoundError('Treinador');

    // 2. Regra de negócio: no máximo 6 no time
    // Checagem rápida antes da PokéAPI, para não fazer uma chamada externa à toa
    const teamSize = await this.pokemonRepository.countByTrainerId(trainerId);
    if (teamSize >= MAX_TEAM_SIZE) {
      throw new ConflictError(TEAM_FULL_MESSAGE);
    }

    // 3. Busca imagem, atributos base e tipos na PokéAPI
    const details = await this.pokeApiGateway.findByName(pokemonName);
    if (!details) throw new NotFoundError('Pokémon');

    // 4. Salva a captura associada ao treinador
    const pokemon = new Pokemon({
      id: randomUUID(),
      pokedexId: details.id,
      name: details.name,
      types: details.types,
      spriteUrl: details.spriteUrl,
      level: 1,
      stats: details.stats,
      trainerId,
      capturedAt: new Date(),
    });
    // A regra é revalidada de forma atômica no salvamento: outra captura
    // simultânea pode ter ocupado a última vaga depois da checagem do passo 2
    const added = await this.pokemonRepository.createIfTeamHasRoom(
      pokemon,
      MAX_TEAM_SIZE,
    );
    if (!added) {
      throw new ConflictError(TEAM_FULL_MESSAGE);
    }
    return pokemon;
  }
}
