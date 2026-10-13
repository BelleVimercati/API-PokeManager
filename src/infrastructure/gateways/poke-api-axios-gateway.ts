import axios from 'axios';
import {
  ExternalPokemonDetails,
  PokemonExternalGateway,
} from '@domain/gateways/pokemon-external-gateway';
import { ServiceUnavailableError } from '@domain/errors/service-unavailable-error';

// Formato (parcial) da resposta da PokéAPI: fica restrito a este arquivo
// para que o JSON externo não vaze para o domínio (camada anti-corrupção)
interface PokeApiPokemonResponse {
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  sprites: {
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
}

export class PokeApiAxiosGateway implements PokemonExternalGateway {
  private readonly http = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    timeout: 5000,
  });

  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    try {
      const slug = encodeURIComponent(name.trim().toLowerCase());
      const { data } = await this.http.get<PokeApiPokemonResponse>(
        `/pokemon/${slug}`,
      );
      return this.toDetails(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new ServiceUnavailableError(
        'Não foi possível consultar a PokéAPI no momento',
      );
    }
  }

  private toDetails(data: PokeApiPokemonResponse): ExternalPokemonDetails {
    return {
      name: data.name,
      types: [...data.types]
        .sort((a, b) => a.slot - b.slot)
        .map((t) => t.type.name),
      spriteUrl:
        data.sprites.other?.['official-artwork']?.front_default ?? null,
      baseExperience: data.base_experience,
      height: data.height,
      weight: data.weight,
    };
  }
}
