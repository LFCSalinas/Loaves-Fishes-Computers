import bcrypt from 'bcrypt'
import * as dbService from "../../services/repository/dbService.js";

export const getUsers = async (req, res) => {
    // Get all Users in table
    try {
        const users = await dbService.findAllUsers()
        return res.json(users);
    } catch (err) {
        console.error(err)
    }
}

export const getUser = async (req, res) => {
    // Get a User by their primary key
    try {
        const user = await dbService.findUserById(req.params.id)
        return res.json(user)
    } catch (err) {
        console.error(err)
    }
}

export const createUser = async (req, res) => {
    // TODO: Refactor default value declaration (either into SQL or elsewhere)
    const role = 'USER'
    const volunteer_id = null

    // Create a User given data
    try{
        const {username, password, email} = req.body
        // Check for pre-existing User in repository (by email)
        const fetchResult = await dbService.findUserByEmail(email);
        if (fetchResult) throw "An account with that email already exists"

        // Encrypt password
        const hashed_pwd = await bcrypt.hash(password, 10);

        // Add User to repository
        const user = await dbService.addUser(username, hashed_pwd, email, role, volunteer_id);
        return res.json(user)

    } catch (err) {
        console.error(err)
    }
};

export const updateUser = async (req, res) => {
    // Update a User's fields
    try {
        // Check input is clean
        const {username, password, email, role, v_id, u_id} = req.body

        // Update User in repository
        await dbService.updateUserById(username, password, email, role, v_id, u_id)
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
}

export const deleteUser = async (req, res) => {
    // Delete a User by their primary key
    try{
        // Check for user
        const user = await dbService.findUserById(req.params.id)
        if (user)
            await dbService.deleteUserById(req.params.id)
            return res.sendStatus(200)
    } catch (err) {
        console.error(err)
    }
}