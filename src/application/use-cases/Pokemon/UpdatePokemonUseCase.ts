import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon } from '@domain/entities/Pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';

interface UpdatePokemonDTO {
  id: string;
  name?: string;
  type?: string;
  level?: number;
}

export class UpdatePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(data: UpdatePokemonDTO): Promise<Pokemon> {
    const existingPokemon = await this.pokemonRepository.findById(data.id);

    if (!existingPokemon) {
      throw new NotFoundError('Pokemon');
    }

    const updatedPokemon = new Pokemon({
      id: existingPokemon.id,
      name: data.name ?? existingPokemon.name,
      type: data.type ?? existingPokemon.type,
      level: data.level ?? existingPokemon.level,
      // Dados da PokéAPI não são editáveis pelo cliente: preserva os atuais
      spriteUrl: existingPokemon.spriteUrl,
      baseExperience: existingPokemon.baseExperience,
      height: existingPokemon.height,
      weight: existingPokemon.weight,
      // A posse só muda pela captura, não pelo PUT
      trainerId: existingPokemon.trainerId,
    });

    await this.pokemonRepository.update(updatedPokemon);
    return updatedPokemon;
  }
}
