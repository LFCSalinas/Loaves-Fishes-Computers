import * as emcontactRepository from "../../services/repository/emcontactRepository.js";

export const createContact = async (req, res) => {
    try{
        const {first_name, last_name, relation, phone} = req.body
        const contact = await emcontactRepository.addContact(first_name, last_name, relation, phone);
        return res.json(contact)
    } catch (err) {
        console.error(err)
    }
}
export const getContact = async (req, res) => {
    try {
        const contact = await emcontactRepository.findContactById(req.params.id)
        return res.json(contact)
    } catch (err) {
        console.error(err)
    }
}
export const updateContact = async (req, res) => {
    try{
        const {first_name, last_name, relation, phone} = req.body
        const contact = await emcontactRepository.updateContactById(first_name, last_name, relation, phone, req.params.id);
        return res.json(contact)
    } catch (err) {
        console.error(err)
    }
}
export const deleteContact = async (req, res) => {
    try{
        const contact = await emcontactRepository.findContactById(req.params.id)
        if (contact)
            await emcontactRepository.deleteContactById(req.params.id)
        return res.sendStatus(200)
    } catch (err) {
        console.error(err)
    }
}
