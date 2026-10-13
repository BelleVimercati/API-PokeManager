import { CapturePokemonUseCase } from '@application/use-cases/Capture/CapturePokemonUseCase';
import { GetTrainerTeamUseCase } from '@application/use-cases/Capture/GetTrainerTeamUseCase';
import { CaptureController } from '@infrastructure/http/controllers/CaptureController';
import { PrismaPokemonRepository } from '@infrastructure/database/prisma/prismaPokemon.repository';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prismaTrainers.repository';

const pokemonRepository = new PrismaPokemonRepository();
const trainerRepository = new PrismaTrainerRepository();

export function makeCaptureController(): CaptureController {
  return new CaptureController(
    new CapturePokemonUseCase(pokemonRepository, trainerRepository),
    new GetTrainerTeamUseCase(pokemonRepository, trainerRepository),
  );
}
