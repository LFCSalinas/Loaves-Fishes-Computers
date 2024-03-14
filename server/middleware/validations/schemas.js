// import userSchema from './userSchema.js'
import Joi from "joi";

const userSchema = Joi.object({
    username: Joi.string().alphanum().max(25),
    email: Joi.string().email(),
    password: Joi.string(), // Assuming password input are strings
    pwd_confirm: Joi.any().equal(Joi.ref('password')),
});

const volunteerSchema = Joi.object({
    // TODO: Allow these to be omitted
    volunteer_id: Joi.number(),
    member_since: Joi.date(),
    active: Joi.any().optional().allow(null),
    em_contact_id: Joi.number(),
    address_id: Joi.number(),

    first_name: Joi.string().alphanum().max(45),
    last_name: Joi.string().alphanum().max(45),
    phone: Joi.string().max(20),
    birthday: Joi.date(),
    gender: Joi.number().max(3),
    image_filename: Joi.string().max(45).optional().allow(null),
    form_filename: Joi.string().max(45).optional().allow(null),
    motivation: Joi.string().max(45),
    skills: Joi.string().max(60000),
    languages: Joi.string().max(255),
    place_of_birth: Joi.string().max(255),
});

const addressSchema = Joi.object({
    street: Joi.string().alphanum().max(30),
    city: Joi.string().alphanum().max(30),
    state: Joi.string().alphanum().max(2)
})

const contactSchema = Joi.object({
    first_name: Joi.string().alphanum().max(45),
    last_name: Joi.string().alphanum().max(45),
    phone: Joi.string().max(20),
    relation: Joi.string().alphanum().max(45)
})

const jobSchema = Joi.object({
    company: Joi.string().alphanum().max(45),
    title: Joi.string().alphanum().max(45),
    years: Joi.string().alphanum().max(45),
    duties: Joi.string().max(60000)
})

export const schemas = {
    userSchema, volunteerSchema, addressSchema, contactSchema, jobSchema
};