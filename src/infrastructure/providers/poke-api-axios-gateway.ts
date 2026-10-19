import axios from 'axios';
import {
  ExternalPokemonDetails,
  IPokeApiGateway,
} from '@domain/gateways/IPokeApiGateway';
import { ServiceUnavailableError } from '@domain/errors/service-unavailable-error';

// Formato (parcial) da resposta da PokéAPI: fica restrito a este arquivo
// para que o JSON externo não vaze para o domínio (camada anti-corrupção)
interface PokeApiPokemonResponse {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
}

// Limite estrito: a requisição não pode ficar pendente se a PokéAPI oscilar
const POKEAPI_TIMEOUT_MS = 3000;

const POKEAPI_UNAVAILABLE_MESSAGE =
  'O serviço externo da PokeAPI está temporariamente indisponível. Tente novamente mais tarde';

// Códigos do Axios/Node que indicam timeout, 5xx ou serviço fora do ar
const UNAVAILABLE_ERROR_CODES = new Set([
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_BAD_RESPONSE',
  'ERR_NETWORK',
  'ENOTFOUND',
  'ECONNREFUSED',
]);

export class PokeApiAxiosGateway implements IPokeApiGateway {
  private readonly http = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    timeout: POKEAPI_TIMEOUT_MS,
  });

  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    try {
      const slug = encodeURIComponent(name.trim().toLowerCase());
      const { data } = await this.http.get<PokeApiPokemonResponse>(
        `/pokemon/${slug}`,
      );
      return this.toDetails(data);
    } catch (error) {
      // Erro que não veio do Axios é bug nosso: deixa virar 500
      if (!axios.isAxiosError(error)) {
        throw error;
      }
      if (error.response?.status === 404) {
        return null;
      }
      if (error.code && UNAVAILABLE_ERROR_CODES.has(error.code)) {
        console.warn(`[PokeAPI] falha de infraestrutura: ${error.code}`);
      }
      throw new ServiceUnavailableError(POKEAPI_UNAVAILABLE_MESSAGE);
    }
  }

  private toDetails(data: PokeApiPokemonResponse): ExternalPokemonDetails {
    // A PokéAPI devolve os stats como lista: [{ base_stat, stat: { name } }]
    const stat = (name: string): number =>
      data.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

    return {
      id: data.id,
      name: data.name,
      types: [...data.types]
        .sort((a, b) => a.slot - b.slot)
        .map((t) => t.type.name),
      spriteUrl:
        data.sprites.other?.['official-artwork']?.front_default ?? null,
      baseExperience: data.base_experience,
      height: data.height,
      weight: data.weight,
      stats: {
        hp: stat('hp'),
        attack: stat('attack'),
        defense: stat('defense'),
        specialAttack: stat('special-attack'),
        specialDefense: stat('special-defense'),
        speed: stat('speed'),
      },
    };
  }
}
