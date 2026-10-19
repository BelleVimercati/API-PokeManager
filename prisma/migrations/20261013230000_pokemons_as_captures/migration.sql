-- A tabela pokemons deixa de ser um catálogo local e passa a guardar só
-- capturas (dados vindos da PokéAPI). As linhas antigas são dados de teste
-- no formato anterior, sem stats nem treinador obrigatório: são descartadas.
DELETE FROM "pokemons";

-- DropForeignKey
ALTER TABLE "pokemons" DROP CONSTRAINT "pokemons_trainer_id_fkey";

-- AlterTable
ALTER TABLE "pokemons" DROP COLUMN "base_experience",
DROP COLUMN "height",
DROP COLUMN "type",
DROP COLUMN "weight",
ADD COLUMN     "attack" INTEGER NOT NULL,
ADD COLUMN     "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defense" INTEGER NOT NULL,
ADD COLUMN     "hp" INTEGER NOT NULL,
ADD COLUMN     "pokedex_id" INTEGER NOT NULL,
ADD COLUMN     "special_attack" INTEGER NOT NULL,
ADD COLUMN     "special_defense" INTEGER NOT NULL,
ADD COLUMN     "speed" INTEGER NOT NULL,
ADD COLUMN     "types" TEXT[],
ALTER COLUMN "trainer_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

