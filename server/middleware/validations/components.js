import {check} from 'express-validator';

// const firstNameValidation = () => [
//     check('first_name', 'First name field cannot be empty.').not().isEmpty(),
//     check('first_name', 'First name must be less than 25 characters long.').isLength({ max: 25 })
// ];
//
// const lastNameValidation = () => [
//     check('last_name', 'Last name field cannot be empty.').not().isEmpty(),
//     check('last_name', 'Last name must be less than 25 characters long.').isLength({ max: 25 })
// ];
//
// const emailValidation = () => [
//     check('email', 'The email you entered is invalid, please try again.').isEmail().normalizeEmail(),
//     check('email', 'Email address must be between 4-50 characters long, please try again.').isLength({ min: 4, max: 50 })
// ];
//
// const passwordValidation = () => [
//     check("password_confirm", "Password confirm field cannot be empty.").not().isEmpty(),
//     check('password', 'Password must be between 8-60 characters long.').isLength({ min: 8, max: 60 }),
//     check('password', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
//     check('password', "Passwords don't match, please try again.").custom((value, { req }) => value === req.body.password_confirm)
// ];
//
