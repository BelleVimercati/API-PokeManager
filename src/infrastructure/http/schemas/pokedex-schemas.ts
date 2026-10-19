import { z } from 'zod';

export const searchPokedexQuerySchema = z.object({
  name: z
    .string({ error: 'O nome do Pokémon é obrigatório' })
    .trim()
    .min(1, 'O nome do Pokémon não pode ser vazio')
    .toLowerCase(),
});
