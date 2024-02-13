import Joi from 'joi';

const loginSchema = Joi.object({
    username: Joi.string().alphanum().max(25).required(),
    password: Joi.string().required(), // Assuming password input are strings
});

export default loginSchema;
