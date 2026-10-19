import { beforeEach, describe, expect, it } from 'vitest';
import { ReleasePokemonUseCase } from '@application/use-cases/Capture/ReleasePokemonUseCase';
import { InMemoryPokemonRepository } from '@infrastructure/database/in-memory/InMemoryPokemonRepository';
import { InMemoryTrainerRepository } from '@infrastructure/database/in-memory/InMemoryTrainerRepository';
import { NotFoundError } from '@domain/errors/not-found-error';
import { createTrainer, makePokemon } from './helpers';

describe('ReleasePokemonUseCase', () => {
  let pokemonRepository: InMemoryPokemonRepository;
  let trainerRepository: InMemoryTrainerRepository;
  let sut: ReleasePokemonUseCase;

  beforeEach(() => {
    pokemonRepository = new InMemoryPokemonRepository();
    trainerRepository = new InMemoryTrainerRepository();
    sut = new ReleasePokemonUseCase(pokemonRepository, trainerRepository);
  });

  it('remove o Pokémon do time do treinador', async () => {
    const trainer = await createTrainer(trainerRepository);
    const pokemon = makePokemon(trainer.id!);
    await pokemonRepository.createIfTeamHasRoom(pokemon, 6);

    await sut.execute({ trainerId: trainer.id!, pokemonId: pokemon.id });

    expect(await pokemonRepository.findById(pokemon.id)).toBeNull();
  });

  it('libera vaga no time para uma nova captura', async () => {
    const trainer = await createTrainer(trainerRepository);
    const team = Array.from({ length: 6 }, () => makePokemon(trainer.id!));
    for (const pokemon of team) {
      await pokemonRepository.createIfTeamHasRoom(pokemon, 6);
    }

    await sut.execute({ trainerId: trainer.id!, pokemonId: team[0].id });

    expect(
      await pokemonRepository.createIfTeamHasRoom(makePokemon(trainer.id!), 6),
    ).toBe(true);
  });

  it('lança NotFoundError se o treinador não existe', async () => {
    await expect(
      sut.execute({ trainerId: 999, pokemonId: 'qualquer' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('lança NotFoundError se o Pokémon não existe', async () => {
    const trainer = await createTrainer(trainerRepository);

    await expect(
      sut.execute({ trainerId: trainer.id!, pokemonId: 'inexistente' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('não permite soltar o Pokémon de outro treinador', async () => {
    const ash = await createTrainer(trainerRepository, 'Ash');
    const misty = await createTrainer(trainerRepository, 'Misty');
    const pokemonDaMisty = makePokemon(misty.id!);
    await pokemonRepository.createIfTeamHasRoom(pokemonDaMisty, 6);

    await expect(
      sut.execute({ trainerId: ash.id!, pokemonId: pokemonDaMisty.id }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(await pokemonRepository.findById(pokemonDaMisty.id)).not.toBeNull();
  });
});
