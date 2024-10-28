const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/ai.service');
const nvdService = require('../services/cve-nvd.service');
const ReportGenerator = require('../utils/reportGenerator'); // Adjust path as needed

exports.getReport = catchAsync(async (req, res, next) => {
    try {
        // Obtain vulnerability data
        const vulnerability = await nvdService.getNVDResponse();

        // Generate AI response content
        //const aiContent = await aiService.generateAIResponse(vulnerability);

        // Generate Word report with the retrieved content
        const reportGenerator = new ReportGenerator();
        const wordBuffer = await reportGenerator.createReport([vulnerability]);

        // Set headers and send the file as a response
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="generated-report.docx"'
        );
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        res.send(wordBuffer);

    } catch (error) {
        console.error('Report Generation Error:', error);
        return next(new AppError(error.message || 'Failed to generate report', 500));
    }
});
