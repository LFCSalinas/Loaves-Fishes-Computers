import Joi from 'joi';

const createUserSchema = Joi.object({
    username: Joi.string().alphanum().max(25).required(),
    password: Joi.string().required(), // Assuming password input are strings
    email: Joi.string().email().required(),
    role: Joi.string().required()
});

export default createUserSchema;
