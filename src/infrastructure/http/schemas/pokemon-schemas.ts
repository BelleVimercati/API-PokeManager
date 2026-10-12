import { z } from 'zod';

export const createPokemonSchema = z.object({
  name: z
    .string({ error: 'O nome é obrigatório' })
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres'),
  type: z
    .string({ error: 'O tipo é obrigatório' })
    .trim()
    .min(3, 'O tipo deve ter no mínimo 3 caracteres'),
  level: z
    .number({ error: 'O nível é obrigatório' })
    .int('O nível deve ser um número inteiro')
    .min(1, 'O nível deve ser um número inteiro positivo'),
});

export const updatePokemonSchema = createPokemonSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'Pelo menos um campo deve ser fornecido para atualização',
  });

export const updatePokemonLevelSchema = createPokemonSchema.pick({
  level: true,
});

export const pokemonIdParamsSchema = z.object({
  id: z.uuid('O ID deve ser um UUID válido'),
});

export const listPokemonQuerySchema = z.object({
  type: z.string().trim().min(1).optional(),
});

export const searchPokemonQuerySchema = z.object({
  name: z
    .string({ error: 'O termo de busca é obrigatório' })
    .trim()
    .min(1, 'O termo de busca não pode ser vazio'),
});
