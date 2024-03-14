import * as volunteerRepository from "../../services/repository/volunteerRepository.js";
import * as dbService from "../../services/repository/dbService.js";

import * as pdfService from "../../services/pdfService.js";
import {promises as fs} from "fs";
import * as addressRepository from "../../services/repository/addressRepository.js";
import * as contactRepository from "../../services/repository/emcontactRepository.js";

import dayjs from "dayjs";

export const createVolunteer = async (req, res) => {
    try {
        const user_id = req.body.userId
        if (user_id && req.body.form){
            const user = await dbService.findUserById(user_id)

            if (user){
                let volunteer_id = user.volunteer_id
                if (!volunteer_id) {
                    // Create new Volunteer record and link to User
                    // TODO: Reparent Volunteer creation to separate feature
                    // TODO: Improve foreign record creation
                    // Signing waiver/webforms should not be the creation of a Volunteer (Field Mismatch!).
                    volunteer_id = await volunteerRepository.addVolunteer({ })
                    await dbService.linkVolunteer(user_id, volunteer_id)

                    let address_id = await addressRepository.addAddress("", "", "")
                    await volunteerRepository.linkAddress(volunteer_id, address_id)

                    let contact_id = await contactRepository.addContact("", "", "", "")
                    await volunteerRepository.linkContact(volunteer_id, contact_id)
                    // await jobRepository.addJob("", "", "", "")

                }

                // CREATE SERIALIZED PDF BYTEARRAY BUFFER FROM BODY
                const pdfBytes = await pdfService.createPDF(req.body.form, "resources/LFC_Forms_Edit_Version.pdf")
                const filename = `LFC_Forms_Volunteer_${volunteer_id}_${Date.now()}`;
                await fs.writeFile(`user-forms/${filename}.pdf`, pdfBytes)
                console.log(`Step 4: Volunteer record ${volunteer_id}'s 'forms' field updated to '${filename}'`)

                // Update Volunteer in DB with new form (filename)
                await volunteerRepository.updateVolunteerFormById(volunteer_id, filename)
            }

            // // UPLOAD THE PDF TO AWS
            // await s3.uploadPDF(req.user.id, filename);
            // console.log("Step 2: Uploaded new PDF to Amazon S3");
            //
            // // IF THE USER HAD PREVIOUSLY SUBMITTED A FORM, DELETE IT FROM AWS
            // if (req.user.forms != null) {
            //     await s3.deleteForms(req.user.id, req.user.forms);
            //     console.log("Step 3: Deleted old PDF from AWS")
            // }

            // REMOVE THE PDF FROM THE USER-FORMS FOLDER
            // await fs.unlink(`user-forms/${filename}.pdf`)
            // console.log(`Step 5: Deleted '${filename}.pdf' from local directory 'user-forms/'`)
        }

        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const getVolunteer = async (req, res) => {
    // Get a Volunteer by their primary key
    try {
        const volunteer = await volunteerRepository.findVolunteerById(req.params.id)
        return res.json(volunteer)
    } catch (err) {
        console.error(err)
    }
}

export const updateVolunteer = async (req, res) =>
{
    // Update a Volunteer's fields
    try {
        const {first_name, last_name, phone, member_since, birthday, gender, active, em_contact_id, address_id, image_filename, form_filename, motivation, skills, languages, place_of_birth} = req.body

        // Update Volunteer in repository
        await volunteerRepository.updateVolunteerById(req.params.id, first_name, last_name, phone, dayjs(member_since).format('YYYY-MM-DD HH:mm:ss'), dayjs(birthday).format('YYYY-MM-DD'), gender, active, em_contact_id, address_id, image_filename, form_filename, motivation, skills, languages, place_of_birth)
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
}