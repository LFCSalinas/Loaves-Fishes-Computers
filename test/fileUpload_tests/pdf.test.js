const pdfService = require("../../services/pdfService.js");
const fs = require("fs");

// Test: parse form-fillable pdf | return form
test('createPDF', async () => {
    const bytes = await pdfService.getPDF("test/fileUpload_tests/test.pdf")

    const values = ["Filled 1", "Filled 2"]
    const filledBytes = await pdfService.fillPDF(bytes, values);
    // await pdfService.logPDF(filledBytes);

    // CREATE PDF FILE
    const filename = `LFC_Forms_Volunteer_Copy_${Date.now()}.pdf`;
    fs.writeFile(`user-forms/${filename}`, filledBytes, (err) => {})
});