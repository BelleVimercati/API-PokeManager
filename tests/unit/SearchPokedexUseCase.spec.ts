import { describe, expect, it } from 'vitest';
import { SearchPokedexUseCase } from '@application/use-cases/Pokedex/SearchPokedexUseCase';
import { InMemoryPokemonGateway } from '@infrastructure/providers/in-memory-pokemon-gateway';
import { NotFoundError } from '@domain/errors/not-found-error';

describe('SearchPokedexUseCase', () => {
  const sut = new SearchPokedexUseCase(new InMemoryPokemonGateway());

  it('retorna os dados do Pokémon vindos da PokéAPI', async () => {
    const details = await sut.execute('charmander');

    expect(details.id).toBe(4);
    expect(details.types).toEqual(['fire']);
    expect(details.stats.speed).toBe(65);
  });

  it('lança NotFoundError se o Pokémon não existe', async () => {
    await expect(sut.execute('naoexiste')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
