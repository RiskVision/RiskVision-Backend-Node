/*import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import fs from "fs";
import path from "path";

class ReportGenerator {
    async createReport(text) {
        const doc = new Document();

        // Add text to the document
        const paragraphs = text.map(t => new Paragraph(t));

        // Add images to the document
        /* const imageRuns = await Promise.all(images.map(async (imgPath) => {
            const imageBuffer = fs.readFileSync(path.resolve(imgPath));
            return new ImageRun({
                data: imageBuffer,
                transformation: {
                    width: 100,
                    height: 100,
                },
            });
        })); 

        // Add paragraphs and images to the document
        doc.addSection({
            children: [
                ...paragraphs,
                 ...imageRuns.map(imgRun => new Paragraph(imgRun)), 
            ],
        });

        // Create the .docx file
        const buffer = await Packer.toBuffer(doc);
        return buffer;
    }
}

export default ReportGenerator;*/