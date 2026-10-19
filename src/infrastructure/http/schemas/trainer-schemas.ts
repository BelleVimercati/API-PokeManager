import { z } from 'zod';

export const createTrainerSchema = z.object({
  name: z
    .string({ error: 'O nome é obrigatório' })
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  email: z
    .email('O e-mail deve ser válido')
    .max(150, 'O e-mail deve ter no máximo 150 caracteres')
    .optional(),
  specialty: z
    .string({ error: 'A especialidade deve ser um texto' })
    .trim()
    .min(1, 'A especialidade não pode ser vazia')
    .max(100, 'A especialidade deve ter no máximo 100 caracteres')
    .optional(),
});

export const updateTrainerSchema = createTrainerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'Pelo menos um campo deve ser fornecido para atualização',
  });

export const trainerIdParamsSchema = z.object({
  id: z.coerce
    .number({ error: 'O id do treinador deve ser um número' })
    .int('O id do treinador deve ser um número inteiro')
    .positive('O id do treinador deve ser um número inteiro positivo'),
});

export const trainerIdRouteParamsSchema = z.object({
  trainerId: z.coerce
    .number()
    .int()
    .positive('O id do treinador deve ser um número inteiro positivo'),
});

export const teamPokemonParamsSchema = trainerIdRouteParamsSchema.extend({
  pokemonId: z.uuid('O id do Pokémon deve ser um UUID válido'),
});

export const capturePokemonSchema = z.object({
  name: z
    .string({ error: 'O nome do Pokémon é obrigatório' })
    .trim()
    .min(1, 'O nome do Pokémon não pode ser vazio')
    .toLowerCase(),
});
