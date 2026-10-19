import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CapturePokemonUseCase,
  MAX_TEAM_SIZE,
} from '@application/use-cases/Capture/CapturePokemonUseCase';
import { InMemoryPokemonRepository } from '@infrastructure/database/in-memory/InMemoryPokemonRepository';
import { InMemoryTrainerRepository } from '@infrastructure/database/in-memory/InMemoryTrainerRepository';
import { InMemoryPokemonGateway } from '@infrastructure/providers/in-memory-pokemon-gateway';
import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';
import { createTrainer, makePokemon } from './helpers';

describe('CapturePokemonUseCase', () => {
  let pokemonRepository: InMemoryPokemonRepository;
  let trainerRepository: InMemoryTrainerRepository;
  let gateway: InMemoryPokemonGateway;
  let sut: CapturePokemonUseCase;

  beforeEach(() => {
    pokemonRepository = new InMemoryPokemonRepository();
    trainerRepository = new InMemoryTrainerRepository();
    gateway = new InMemoryPokemonGateway();
    sut = new CapturePokemonUseCase(
      pokemonRepository,
      trainerRepository,
      gateway,
    );
  });

  it('captura o Pokémon com os dados da PokéAPI e associa ao treinador', async () => {
    const trainer = await createTrainer(trainerRepository);

    const pokemon = await sut.execute({
      trainerId: trainer.id!,
      pokemonName: 'bulbasaur',
    });

    expect(pokemon.trainerId).toBe(trainer.id);
    expect(pokemon.pokedexId).toBe(1);
    expect(pokemon.types).toEqual(['grass', 'poison']);
    expect(pokemon.stats).toEqual({
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    });
    expect(pokemon.level).toBe(1);
    expect(pokemonRepository.items).toHaveLength(1);
  });

  it('permite capturar o mesmo Pokémon mais de uma vez', async () => {
    const trainer = await createTrainer(trainerRepository);

    await sut.execute({ trainerId: trainer.id!, pokemonName: 'pikachu' });
    await sut.execute({ trainerId: trainer.id!, pokemonName: 'pikachu' });

    expect(await pokemonRepository.countByTrainerId(trainer.id!)).toBe(2);
  });

  it('lança NotFoundError se o treinador não existe, sem consultar a PokéAPI', async () => {
    const findByName = vi.spyOn(gateway, 'findByName');

    await expect(
      sut.execute({ trainerId: 999, pokemonName: 'pikachu' }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(findByName).not.toHaveBeenCalled();
  });

  it('lança NotFoundError se o Pokémon não existe na PokéAPI', async () => {
    const trainer = await createTrainer(trainerRepository);

    await expect(
      sut.execute({ trainerId: trainer.id!, pokemonName: 'naoexiste' }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(pokemonRepository.items).toHaveLength(0);
  });

  it(`bloqueia a captura quando o time já tem ${MAX_TEAM_SIZE} Pokémons, sem consultar a PokéAPI`, async () => {
    const trainer = await createTrainer(trainerRepository);
    for (let i = 0; i < MAX_TEAM_SIZE; i++) {
      await pokemonRepository.createIfTeamHasRoom(
        makePokemon(trainer.id!),
        MAX_TEAM_SIZE,
      );
    }
    const findByName = vi.spyOn(gateway, 'findByName');

    const result = sut.execute({
      trainerId: trainer.id!,
      pokemonName: 'pikachu',
    });

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ statusCode: 409 });
    expect(findByName).not.toHaveBeenCalled();
    expect(pokemonRepository.items).toHaveLength(MAX_TEAM_SIZE);
  });

  it('o limite de um treinador não afeta outro treinador', async () => {
    const ash = await createTrainer(trainerRepository, 'Ash');
    const misty = await createTrainer(trainerRepository, 'Misty');
    for (let i = 0; i < MAX_TEAM_SIZE; i++) {
      await sut.execute({ trainerId: ash.id!, pokemonName: 'pikachu' });
    }

    await expect(
      sut.execute({ trainerId: misty.id!, pokemonName: 'charmander' }),
    ).resolves.toBeDefined();
  });

  it('lança ConflictError se a última vaga for ocupada entre a checagem e o salvamento', async () => {
    // Simula outra captura simultânea: a contagem inicial vê vaga,
    // mas o salvamento atômico encontra o time já cheio
    const trainer = await createTrainer(trainerRepository);
    vi.spyOn(pokemonRepository, 'createIfTeamHasRoom').mockResolvedValue(false);

    await expect(
      sut.execute({ trainerId: trainer.id!, pokemonName: 'pikachu' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it(`capturas simultâneas nunca passam de ${MAX_TEAM_SIZE} no time`, async () => {
    const trainer = await createTrainer(trainerRepository);

    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () =>
        sut.execute({ trainerId: trainer.id!, pokemonName: 'pikachu' }),
      ),
    );

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(fulfilled).toHaveLength(MAX_TEAM_SIZE);
    expect(rejected).toHaveLength(10 - MAX_TEAM_SIZE);
    expect(await pokemonRepository.countByTrainerId(trainer.id!)).toBe(
      MAX_TEAM_SIZE,
    );
  });
});
