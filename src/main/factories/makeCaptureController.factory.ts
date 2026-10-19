import { CapturePokemonUseCase } from '@application/use-cases/Capture/CapturePokemonUseCase';
import { GetTrainerTeamUseCase } from '@application/use-cases/Capture/GetTrainerTeamUseCase';
import { ReleasePokemonUseCase } from '@application/use-cases/Capture/ReleasePokemonUseCase';
import { CaptureController } from '@infrastructure/http/controllers/CaptureController';
import { PrismaPokemonRepository } from '@infrastructure/database/prisma/prismaPokemon.repository';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prismaTrainers.repository';
import { makePokeApiGateway } from '@main/factories/makePokeApiGateway.factory';

const pokemonRepository = new PrismaPokemonRepository();
const trainerRepository = new PrismaTrainerRepository();
const pokeApiGateway = makePokeApiGateway();

export function makeCaptureController(): CaptureController {
  return new CaptureController(
    new CapturePokemonUseCase(
      pokemonRepository,
      trainerRepository,
      pokeApiGateway,
    ),
    new GetTrainerTeamUseCase(pokemonRepository, trainerRepository),
    new ReleasePokemonUseCase(pokemonRepository, trainerRepository),
  );
}
