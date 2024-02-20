import {PDFDocument, PDFRadioGroup, PDFTextField} from "pdf-lib";
import fs from 'fs';


export const createPDF = async (formData, file) => {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(file))

    const form = pdfDoc.getForm()
    const fields = form.getFields()

    fields.forEach((field) => {
        const fieldName = field.getName()
        let value = formData[fieldName] || ""; // Turn null values into ""

        if (field instanceof PDFTextField) {
            form.getTextField(fieldName).setText(value)
        } else if (field instanceof PDFRadioGroup) {
            form.getRadioGroup(fieldName).select(value)
        }
    });

    return await pdfDoc.save();
}
