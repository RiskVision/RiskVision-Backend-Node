const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/ai.service');
const VulnerabilityScanner = require('../services/cve-nvd.service');
const ReportGenerator = require('../utils/reportGenerator'); // Adjust path as needed
const {sql, poolPromise} = require('../database/dbSQL.js');
const { json } = require('express');
const {paxVulnerabilities} = require('../utils/basePrompt.js');

exports.getReport = catchAsync(async (req, res, next) => {
    try {

        //Extraer los datos de los activos digitales enfocarse en la marca y Sistema Operativo
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT DISTINCT id_activo, nombre_activo, marca, modelo, sistema_operativo, version_os, clasificacion_activo FROM dbo.asset_inventory WHERE marca = 'PAX' ");

        const activos = result.recordset;

        /*

        No se está usando el código por el momento debido a la caída del servidor de NVD, se hard codearon los valores. 



        // Obtain vulnerability data
        const scanner = new VulnerabilityScanner(activos);

        const results = await scanner.start();
        const scannerResults = JSON.stringify(results); // Convertir los resultados a una cadena JSON con formato

        //console.log(scannerResults);
        */

        console.log("Vulnerabilidades limpias" + paxVulnerabilities)

        fullAiPrompt = JSON.stringify(activos, null, 2) + paxVulnerabilities;
        console.log("AI Prompt" + fullAiPrompt);

        // Generate AI response content
        const aiResponse = await aiService.generateAIResponse(fullAiPrompt);

        // Set headers and send the aRepsonse as a response
        return res.status(200).json({
            status: 'success',
            data: {
                content: aiResponse,
            }
        });
        
        //res.send(scannerResults)

    } catch (error) {
        console.error('Report Generation Error:', error);
        return next(new AppError(error.message || 'Failed to generate report', 500));
    }
});
