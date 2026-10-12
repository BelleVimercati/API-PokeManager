"use strict";
/* Esse arquivo centraliza a conexão com o PostgreSQL. Em vez de cada arquivo criar sua própria conexão, todos usam este postgresPool (um "pool", que é um conjunto de conexões reutilizáveis).
Cria um pool único e o exporta para todo o projeto usar.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPool = void 0;
const pg_1 = require("pg");
exports.postgresPool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Teste inicial de comunicação com o banco de dados
exports.postgresPool.on('connect', () => {
    console.log('🐘 [database]: Conexão com o PostgreSQL estabelecida com sucesso!');
});
exports.postgresPool.on('error', (err) => {
    console.error('💥 [database]: Erro inesperado no pool do PostgreSQL:', err);
});
