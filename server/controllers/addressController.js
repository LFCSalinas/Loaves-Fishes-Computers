import * as addressRepository from "../../services/repository/addressRepository.js";

export const createAddress = async (req, res) => {
    try{
        const {street, city, state} = req.body
        const address = await addressRepository.addAddress(street, city, state);
        return res.json(address)

    } catch (err) {
        console.error(err)
    }
}
export const getAddress = async (req, res) => {
    try {
        const address = await addressRepository.findAddressById(req.params.id)
        return res.json(address)
    } catch (err) {
        console.error(err)
    }
}
export const updateAddress = async (req, res) => {
    try{
        const {street, city, state} = req.body
        const address = await addressRepository.updateAddressById(street, city, state, req.params.id);
        return res.json(address)

    } catch (err) {
        console.error(err)
    }
}
export const deleteAddress = async (req, res) => {
    try{
        const address = await addressRepository.findAddressById(req.params.id)
        if (address)
            await addressRepository.deleteAddressById(req.params.id)
        return res.sendStatus(200)
    } catch (err) {
        console.error(err)
    }
}
