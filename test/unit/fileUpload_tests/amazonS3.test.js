// const s3 = require("../../s3.js");
// const fs = require("fs");
// const db = require("../../server/repository/db");
//
// const filename = `LFC_Forms_Volunteer_Copy_${Date.now()}.pdf`;
// const test = {"form1", "form2", "form3",};
//
//
// // CREATE PDF BUFFER
// const pdfBytes = await createPDF(filename,
//     form1_volunteer_name, form1_volunteer_date, form1_volunteer_signature, form1_parent_name, form1_parent_date, form1_parent_signature,
//     form2_volunteer_name, form2_volunteer_date, form2_volunteer_signature,
//     form3_volunteer_name, form3_volunteer_date, form3_volunteer_goal, form3_volunteer_signature,
//     form4_volunteer_initials, form4_volunteer_name, form4_volunteer_date, form4_volunteer_signature, form4_parent_name, form4_child_name, form4_parent_date, form4_parent_signature,
//     form5_volunteer_yes_no, form5_volunteer_name, form5_volunteer_address, form5_volunteer_phone, form5_volunteer_date, form5_volunteer_signature, form5_parent_signature, form5_staff_notes).catch(err => console.log("Was it this error?   " + err.message));
//
// // CREATE PDF FILE WITH BUFFER
// fs.writeFile(`user-forms/${filename}`, pdfBytes, (err) => {
//     if (!err) {
//         console.log("=================================\nStep 1: PDF file was created");
//
//         // UPLOAD THE PDF TO AWS
//         s3.uploadPDF(req.user.id, filename);
//         console.log("Step 2: Uploaded new PDF to AWS");
//
//         // IF THE USER HAD PREVIOUSLY SUBMITTED A FORM, DELETE IT FROM AWS
//         if(req.user.forms != null){
//             s3.deleteForms(req.user.id, req.user.forms);
//             console.log("Step 3: Deleted old PDF from AWS")
//         }
//
//         // REMOVE THE PDF FROM THE USER-FORMS FOLDER
//         let DIR = "user-forms/";
//         fs.readdir(DIR, (err, filesInDirectory) => {
//             if (err) console.log(err.message);
//
//             if(filesInDirectory != ""){
//                 for (let file of filesInDirectory) {
//                     fs.unlinkSync(DIR + file)
//                     console.log("Step 4: Removed PDF from local folder")
//                 }
//             }
//         })
//
//         // UPDATE THE FORM RECORD IN THE DATABASE
//         db.query("UPDATE user SET forms = ? WHERE id = ?", [filename, req.user.id], (err, result) => {
//             if(!err) res.redirect("/dashboard");
//             else console.log(err.message)
//         });
//     } else { console.log("Or was it this error again:  " + err.message)}
// });