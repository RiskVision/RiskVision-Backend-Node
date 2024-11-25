const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } = require("docx");
const fs = require("fs");
//const path = require("path");

class ReportGenerator {
    async createReport(content) {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        // Título del documento
                        new Paragraph({
                            children: [new TextRun({ text: "Análisis de Riesgos de Ciberseguridad", bold: true })],
                            heading: HeadingLevel.HEADING_1,
                            spacing: {
                                before: 200,
                                after: 200
                            }
                        }),
                        // Párrafos de contenido
                        new Paragraph({
                            children: [
                                new TextRun("Este reporte contiene un análisis de riesgos y amenzas de las vulnerabilidades encontradas y los controles que se recomiendan implementar para los mismos."),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Análisis de riesgos:",
                                    bold: true,
                                }),
                            ],
                            spacing: {
                                after: 200, // Espacio después del párrafo
                            },
                        }),
                        // Insertar imagen (heatmap)
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: fs.readFileSync("./assets/heatmap.png"),
                                    transformation: {
                                        width: 400,
                                        height: 300,
                                    },
                                }),
                            ],
                            spacing: {
                                after: 200, // Espacio después del párrafo
                            },
                        }),
                        // Ejemplo de múltiples párrafos y formato
                        new Paragraph({
                            children: [new TextRun(content)],
                            spacing: {
                                after: 200, // Espacio después del párrafo
                            },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Conclusión del análisis de riesgos.",
                                    bold: true,
                                    italics: true,
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        // Devolver el buffer en lugar de escribir en un archivo
        return Packer.toBuffer(doc);
    }
}

module.exports = ReportGenerator;
