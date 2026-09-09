import { readFileSync } from 'node:fs';
import path from 'node:path';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { pokemonRoutes } from '@infrastructure/http/routes/pokemons.routes';
import { errorHandler } from '@infrastructure/http/middlewares/errorHandler';

const openapiPath = path.join(
  __dirname,
  '../infrastructure/http/docs/openapi.json',
);
const openapiDocument = JSON.parse(readFileSync(openapiPath, 'utf-8'));

const app = express();

app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use('/api/v1/pokemons', pokemonRoutes);
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`PokéManager API rodando em http://localhost:${PORT}`);
});
