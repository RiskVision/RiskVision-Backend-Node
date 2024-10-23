// const express = require("express");
// const ReportGenerator = require("../controllers/report.controller.js");

// const router = express();
// const reportGenerator = new ReportGenerator();

// router.post("/create-report", async (req, res) => {
//     const text = req.body.text;

//     try {
//         const reportBuffer = await reportGenerator.createReport(text);

//         // Set headers to indicate a file download
//         res.setHeader("Content-Disposition", "attachment; filename=report.docx");
//         res.setHeader("Content-Type", "routerlication/vnd.openxmlformats-officedocument.wordprocessingml.document");

//         // Send the file as bytes
//         res.send(reportBuffer);
//     } catch (error) {
//         console.error("Error creating report:", error);
//         res.status(500).send("Error creating report");
//     }
// });

// module.exports = router;

// //TODO - No se modificó este archivo porque se necesita más información sobre el flujo de trabajo de la aplicación para poder refactorizarlo.


const express = require('express');
var router = express.Router();

const {
    getReport,
} = require('../controllers/report.controller');

router.route('/getReport')
    .get(getReport);

module.exports = router;