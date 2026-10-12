"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgTrainerRepository = void 0;
const Trainer_1 = require("../../../domain/entities/Trainer.js");
const app_error_1 = require("../../../domain/errors/app.error.js");
const connection_1 = require("./connection");
const UNIQUE_VIOLATION = '23505';
const DUPLICATED_EMAIL_MESSAGE = 'Já existe um Treinador cadastrado com este e-mail.';
function isUniqueViolation(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === UNIQUE_VIOLATION);
}
class PgTrainerRepository {
    async create(trainer) {
        const query = `
      INSERT INTO trainers (nome, email, especialidade)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email, especialidade
    `;
        try {
            const result = await connection_1.postgresPool.query(query, [
                trainer.name,
                trainer.email,
                trainer.specialty,
            ]);
            return this.toEntity(result.rows[0]);
        }
        catch (error) {
            if (isUniqueViolation(error)) {
                throw new app_error_1.AppError(DUPLICATED_EMAIL_MESSAGE, 409);
            }
            throw error;
        }
    }
    async update(trainer) {
        const query = `
      UPDATE trainers
      SET nome = $1, email = $2, especialidade = $3
      WHERE id = $4
    `;
        try {
            await connection_1.postgresPool.query(query, [
                trainer.name,
                trainer.email,
                trainer.specialty,
                trainer.id,
            ]);
        }
        catch (error) {
            if (isUniqueViolation(error)) {
                throw new app_error_1.AppError(DUPLICATED_EMAIL_MESSAGE, 409);
            }
            throw error;
        }
    }
    async findById(id) {
        const query = `SELECT id, nome, email, especialidade FROM trainers WHERE id = $1`;
        const result = await connection_1.postgresPool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.toEntity(result.rows[0]);
    }
    async findAll() {
        const query = `SELECT id, nome, email, especialidade FROM trainers ORDER BY id`;
        const result = await connection_1.postgresPool.query(query);
        return result.rows.map((row) => this.toEntity(row));
    }
    toEntity(row) {
        return new Trainer_1.Trainer({
            id: row.id,
            name: row.nome,
            email: row.email,
            specialty: row.especialidade,
        });
    }
}
exports.PgTrainerRepository = PgTrainerRepository;
