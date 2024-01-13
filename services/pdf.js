const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

async function createPDF(filename, 
                         form1_volunteer_name, form1_volunteer_date, form1_volunteer_signature, form1_parent_name, form1_parent_date, form1_parent_signature,
                         form2_volunteer_name, form2_volunteer_date, form2_volunteer_signature,
                         form3_volunteer_name, form3_volunteer_date, form3_volunteer_goal, form3_volunteer_signature,
                         form4_volunteer_initials, form4_volunteer_name, form4_volunteer_date, form4_volunteer_signature, form4_parent_name, form4_child_name, form4_parent_date, form4_parent_signature,
                         form5_volunteer_yes_no, form5_volunteer_name, form5_volunteer_address, form5_volunteer_phone, form5_volunteer_date, form5_volunteer_signature, form5_parent_signature, form5_staff_notes) {
    // Load LFC forms
    const pdfDoc = await PDFDocument.load(fs.readFileSync("pdf/LFC_Forms_Edit_Version.pdf"));
    
    const form = pdfDoc.getForm();

    const form1_volunteer_nameField = form.getTextField("form1_volunteer_name");
    const form1_volunteer_dateField = form.getTextField("form1_volunteer_date");
    const form1_volunteer_signatureField = form.getTextField("form1_volunteer_signature");
    const form1_parent_nameField = form.getTextField("form1_parent_name");
    const form1_parent_dateField = form.getTextField("form1_parent_date");
    const form1_parent_signatureField = form.getTextField("form1_parent_signature");

    const form2_volunteer_nameField = form.getTextField("form2_volunteer_name");
    const form2_volunteer_dateField = form.getTextField("form2_volunteer_date");
    const form2_volunteer_signatureField = form.getTextField("form2_volunteer_signature");

    const form3_volunteer_nameField = form.getTextField("form3_volunteer_name");
    const form3_volunteer_dateField = form.getTextField("form3_volunteer_date");
    const form3_volunteer_goalField = form.getTextField("form3_volunteer_goal");
    const form3_volunteer_signatureField = form.getTextField("form3_volunteer_signature");

    const form4_volunteer_initialsField = form.getTextField("form4_volunteer_initials");
    const form4_volunteer_nameField = form.getTextField("form4_volunteer_name");
    const form4_volunteer_dateField = form.getTextField("form4_volunteer_date");
    const form4_volunteer_signatureField = form.getTextField("form4_volunteer_signature");
    const form4_parent_nameField = form.getTextField("form4_parent_name");
    const form4_childNameField = form.getTextField("form4_child_name");
    const form4_parent_dateField = form.getTextField("form4_parent_date");
    const form4_parent_signatureField = form.getTextField("form4_parent_signature");

    const form5_volunteer_yesNoField = form.getTextField("form5_volunteer_yes_no");
    const form5_volunteer_nameField = form.getTextField("form5_volunteer_name");
    const form5_volunteer_addressField = form.getTextField("form5_volunteer_address");
    const form5_volunteer_phoneField = form.getTextField("form5_volunteer_phone");
    const form5_volunteer_dateField = form.getTextField("form5_volunteer_date");
    const form5_volunteer_signatureField = form.getTextField("form5_volunteer_signature");
    const form5_parent_signatureField = form.getTextField("form5_parent_signature");
    const form5_staffNotesField = form.getTextField("form5_staff_notes");

    form1_volunteer_nameField.setText(form1_volunteer_name);
    form1_volunteer_dateField.setText(form1_volunteer_date);
    form1_volunteer_signatureField.setText(form1_volunteer_signature);
    form1_parent_nameField.setText(form1_parent_name);
    form1_parent_dateField.setText(form1_parent_date);
    form1_parent_signatureField.setText(form1_parent_signature);

    form2_volunteer_nameField.setText(form2_volunteer_name);
    form2_volunteer_dateField.setText(form2_volunteer_date);
    form2_volunteer_signatureField.setText(form2_volunteer_signature);

    form3_volunteer_nameField.setText(form3_volunteer_name);
    form3_volunteer_dateField.setText(form3_volunteer_date);
    form3_volunteer_goalField.setText(form3_volunteer_goal);
    form3_volunteer_signatureField.setText(form3_volunteer_signature);

    form4_volunteer_initialsField.setText(form4_volunteer_initials);
    form4_volunteer_nameField.setText(form4_volunteer_name);
    form4_volunteer_dateField.setText(form4_volunteer_date);
    form4_volunteer_signatureField.setText(form4_volunteer_signature);
    form4_parent_nameField.setText(form4_parent_name);
    form4_childNameField.setText(form4_child_name);
    form4_parent_dateField.setText(form4_parent_date);
    form4_parent_signatureField.setText(form4_parent_signature);

    form5_volunteer_yesNoField.setText(form5_volunteer_yes_no);
    form5_volunteer_nameField.setText(form5_volunteer_name);
    form5_volunteer_addressField.setText(form5_volunteer_address);
    form5_volunteer_phoneField.setText(form5_volunteer_phone);
    form5_volunteer_dateField.setText(form5_volunteer_date);
    form5_volunteer_signatureField.setText(form5_volunteer_signature);
    form5_parent_signatureField.setText(form5_parent_signature);
    form5_staffNotesField.setText(form5_staff_notes);

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}

exports.createPDF = createPDF;