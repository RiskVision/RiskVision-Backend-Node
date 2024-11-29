const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/ai.service');
const VulnerabilityScanner = require('../services/cve-nvd.service');
const {sql, poolPromise} = require('../database/dbSQL.js');
const { json } = require('express');

exports.getReport = catchAsync(async (req, res, next) => {
    try {
        const pool = await poolPromise;


        //Query de la base de datos acotada buscar los activos de la marca PAX (caso de uso seleccionado del reto)
        const result = await pool
            .request()
            .query(
                "SELECT DISTINCT id_activo, nombre_activo, marca, modelo, sistema_operativo, version_os, clasificacion_activo FROM dbo.asset_inventory WHERE marca = 'PAX'"
            );


        const activos = result.recordset;

        // Obtener los datos necesarios de las vulnerabilidades
        const scanner = new VulnerabilityScanner(activos);

        const results = await scanner.start();
        const scannerResults = JSON.stringify(results); // Convertir los resultados a una cadena JSON con formato

        //Se juntan la información para el prompt y se convierten a un string valido
        const fullAiPromptObject = {
            activos, scannerResults
        };

        const fullAiPrompt = JSON.stringify(fullAiPromptObject);

        // Generar respuesta del servicio AI
        const aiResponse = await aiService.generateAIResponse("A continuación te doy mi activo y la vulnerabilidades encontradas" + fullAiPrompt);

        return res.status(200).json({
            status: "success",
            data: {
                content: aiResponse,
            },
        });
    } catch (error) {
        console.error("Report Generation Error:", error);
        return next(
            new AppError(error.message || "Failed to generate report", 500)
        );
    }
});