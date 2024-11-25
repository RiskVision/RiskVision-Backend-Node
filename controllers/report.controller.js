const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/ai.service');
const VulnerabilityScanner = require('../services/cve-nvd.service');
const ReportGenerator = require('../utils/reportGenerator'); // Adjust path as needed
const {sql, poolPromise} = require('../database/dbSQL.js');
const { json } = require('express');
const {paxVulnerabilities} = require('../utils/scannedVulnerabilities.js');

exports.getReport = catchAsync(async (req, res, next) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(
                "SELECT DISTINCT id_activo, nombre_activo, marca, modelo, sistema_operativo, version_os, clasificacion_activo FROM dbo.asset_inventory WHERE marca = 'PAX'"
            );


        const activos = result.recordset;


        const fullAiPromptObject = {
            activos, paxVulnerabilities // Debe ser un array de objetos, no strings JSON
        };

        // Crear JSON string plano sin escapes adicionales
        const fullAiPrompt = JSON.stringify(fullAiPromptObject);

        console.log("AI Prompt for Azure:", fullAiPrompt);

        // Generar respuesta del servicio AI
        const aiResponse = await aiService.generateAIResponse("Ahi va mi activo y 3 vulnerabilidades encontradas" + fullAiPrompt);

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



/*

No se está usando el código por el momento debido a la caída del servidor de NVD, se hard codearon los valores. 



// Obtain vulnerability data
const scanner = new VulnerabilityScanner(activos);

const results = await scanner.start();
const scannerResults = JSON.stringify(results); // Convertir los resultados a una cadena JSON con formato

//console.log(scannerResults);
*/