import Joi from 'joi';

const createUserSchema = Joi.object({
    username: Joi.string().alphanum().max(25).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(), // Assuming password input are strings
    pwd_confirm: Joi.any().equal(Joi.ref('password')).required(),
});

export default createUserSchema;
