import Joi from 'joi';

const createUserSchema = Joi.object({
    username: Joi.string().alphanum().max(25).required(),
    password: Joi.string().required(), // Assuming passwords are strings, not binary
    email: Joi.string().email().required(),
    role: Joi.string().required()
});

export default createUserSchema;
