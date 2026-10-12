"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const app_error_1 = require("../../../domain/errors/app.error.js");
function errorHandler(error, req, res, _next) {
    if (error instanceof app_error_1.AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            statusCode: error.statusCode,
            message: error.message,
        });
    }
    console.error('💥 [Uncaught Exception]:', error);
    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Erro interno no servidor.',
    });
}
