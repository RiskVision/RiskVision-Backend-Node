const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/ai.service');
const VulnerabilityScanner = require('../services/cve-nvd.service');
const ReportGenerator = require('../utils/reportGenerator'); // Adjust path as needed
const {sql, poolPromise} = require('../database/dbSQL.js');

exports.getReport = catchAsync(async (req, res, next) => {
    try {

        //Extraer los datos de los activos digitales enfocarse en la marca y Sistema Operativo
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT id_activo, nombre_activo, marca, modelo, sistema_operativo, version_so, clasificacion_activo FROM dbo.asset_inventory WHERE marca = 'PAX' ");

        const activos = result.recordset;

        // Obtain vulnerability data
        const scanner = new VulnerabilityScanner(activos);

        const results = await scanner.start();
        const scannerResults = JSON.stringify(results, null, 2); // Convertir los resultados a una cadena JSON con formato

        console.log(scannerResults);

        /* // Generate AI response content
        const aiResponse = await aiService.generateAIResponse(vulnerability);

        // Generate Word report with the retrieved content
        const reportGenerator = new ReportGenerator();
        const wordBuffer = await reportGenerator.createReport(aiResponse); */

        //Guardar reporte en el blob storage de Azure (habrá que cambiar el report generator a usar el código de aylen)

        // Set headers and send the aRepsonse as a response
        //res.send(aiResponse);
        res.send(scannerResults)

    } catch (error) {
        console.error('Report Generation Error:', error);
        return next(new AppError(error.message || 'Failed to generate report', 500));
    }
});
