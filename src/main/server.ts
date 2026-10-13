import 'dotenv/config';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { pokemonRoutes } from '@infrastructure/http/routes/pokemons.routes';
import { trainerRoutes } from '@infrastructure/http/routes/trainers.routes';
import { errorHandler } from '@infrastructure/http/middlewares/errorHandler';
import { NotFoundError } from '@domain/errors/not-found-error';

const openapiPath = path.join(
  __dirname,
  '../infrastructure/http/docs/openapi.json',
);
const openapiDocument = JSON.parse(readFileSync(openapiPath, 'utf-8'));

const app = express();

app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use('/api/v1/pokemons', pokemonRoutes);
app.use('/api/v1/trainers', trainerRoutes);
// Nenhuma rota casou: responde 404 em JSON em vez do HTML padrão do Express
app.use((_req, _res, next) => {
  next(new NotFoundError('Rota', 'Rota não encontrada'));
});
app.use(errorHandler);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
app.listen(PORT, () => {
  console.log(`PokéManager API rodando em http://localhost:${PORT}`);
});
