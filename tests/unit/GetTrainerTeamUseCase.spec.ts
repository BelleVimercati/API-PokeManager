import { beforeEach, describe, expect, it } from 'vitest';
import { GetTrainerTeamUseCase } from '@application/use-cases/Capture/GetTrainerTeamUseCase';
import { InMemoryPokemonRepository } from '@infrastructure/database/in-memory/InMemoryPokemonRepository';
import { InMemoryTrainerRepository } from '@infrastructure/database/in-memory/InMemoryTrainerRepository';
import { NotFoundError } from '@domain/errors/not-found-error';
import { createTrainer, makePokemon } from './helpers';

describe('GetTrainerTeamUseCase', () => {
  let pokemonRepository: InMemoryPokemonRepository;
  let trainerRepository: InMemoryTrainerRepository;
  let sut: GetTrainerTeamUseCase;

  beforeEach(() => {
    pokemonRepository = new InMemoryPokemonRepository();
    trainerRepository = new InMemoryTrainerRepository();
    sut = new GetTrainerTeamUseCase(pokemonRepository, trainerRepository);
  });

  it('retorna apenas os Pokémons do treinador informado', async () => {
    const ash = await createTrainer(trainerRepository, 'Ash');
    const misty = await createTrainer(trainerRepository, 'Misty');
    await pokemonRepository.createIfTeamHasRoom(makePokemon(ash.id!), 6);
    await pokemonRepository.createIfTeamHasRoom(makePokemon(ash.id!), 6);
    await pokemonRepository.createIfTeamHasRoom(makePokemon(misty.id!), 6);

    const team = await sut.execute(ash.id!);

    expect(team).toHaveLength(2);
    expect(team.every((p) => p.trainerId === ash.id)).toBe(true);
  });

  it('retorna lista vazia para treinador sem Pokémons', async () => {
    const trainer = await createTrainer(trainerRepository);

    expect(await sut.execute(trainer.id!)).toEqual([]);
  });

  it('lança NotFoundError se o treinador não existe', async () => {
    await expect(sut.execute(999)).rejects.toBeInstanceOf(NotFoundError);
  });
});
