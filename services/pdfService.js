const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

// filename, field1, field2
getPDF = async function (path){
    // Path from Content Root
    const pdfDoc = await PDFDocument.load(fs.readFileSync(path))
    return await pdfDoc.save();
}

fillPDF = async function (bytes, values){
    const pdfDoc = await PDFDocument.load(bytes);
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    if (fields.length === values.length){
        fields.forEach((field, index) => {
            let value = values[index];
            let name = field.getName()
            form.getTextField(name).setText(value)
        });
    } else {
        console.error("Length mismatch between pdf fields and provided values.")
    }

    return await pdfDoc.save();
}

exports.readyForm = async function (body, filename){
    const {form1_volunteer_name, form1_volunteer_date, form1_volunteer_signature, form1_parent_name, form1_parent_date, form1_parent_signature } = body;
    const {form2_volunteer_name, form2_volunteer_date, form2_volunteer_signature} = body;
    const {form3_volunteer_name, form3_volunteer_date, form3_volunteer_goal, form3_volunteer_signature} = body;
    const {form4_volunteer_initials, form4_volunteer_name, form4_volunteer_date, form4_volunteer_signature, form4_parent_name, form4_child_name, form4_parent_date, form4_parent_signature} = body;
    const {form5_volunteer_yes_no, form5_volunteer_name, form5_volunteer_address, form5_volunteer_phone, form5_volunteer_date, form5_volunteer_signature, form5_parent_signature, form5_staff_notes} = body;

    const form_values = [
        form1_volunteer_name, form1_volunteer_date, form1_volunteer_signature, form1_parent_name, form1_parent_date, form1_parent_signature,
        form2_volunteer_name, form2_volunteer_date, form2_volunteer_signature,
        form3_volunteer_name, form3_volunteer_date, form3_volunteer_goal, form3_volunteer_signature,
        form4_volunteer_initials, form4_volunteer_name, form4_volunteer_date, form4_volunteer_signature, form4_parent_name, form4_child_name, form4_parent_date, form4_parent_signature,
        form5_volunteer_yes_no, form5_volunteer_name, form5_volunteer_address, form5_volunteer_phone, form5_volunteer_date, form5_volunteer_signature, form5_parent_signature, form5_staff_notes
    ]

    // CREATE SERIALIZED PDF BYTEARRAY
    const bytes = await getPDF(filename)
    return await fillPDF(bytes, form_values);
}