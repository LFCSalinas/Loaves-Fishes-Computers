const dbService = require("../../services/dbService.js")
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const {validationResult} = require("express-validator");

const mail = require("../../services/mail.js");
const s3 = require("../../services/s3.js");
const pdfService = require("../../services/pdfService.js");
const fs = require("fs").promises;

const bcrypt = require("bcrypt");
const saltRounds = 10;
const randomString = require("randomstring");

require("dotenv").config();


function get_date(){
    let yourDate = new Date();
    const offset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - (offset*60*1000));
    return yourDate.toISOString().split('T')[0]
}

// REGISTER -------------------------------------------------------


exports.register = async (req, res) => {
    const {first_name, last_name, email, password} = req.body;
    const member_since = get_date();

    // GRAB ANY ERRORS FROM EXPRESS VALIDATOR
    const errors = validationResult(req);
    // STRINGIFY TO PARSE THE DATA
    const allErrors = JSON.stringify(errors);
    const allParsedErrors = JSON.parse(allErrors);
    // OUTPUT VALIDATION ERRORS IF ANY
    if (!errors.isEmpty()) {
        return res.render("register", {
            title: "Register | Loaves Fishes Computers",
            allParsedErrors: allParsedErrors,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        })
    }

    try {
        const fetchResult = await dbService.findUserByEmail(email);
        // CHECK IF EMAIL ALREADY EXISTS IN DATABASE
        console.log("FetchResult:" + fetchResult)
        if (fetchResult !== undefined) {
            return res.render("register", {
                title: "Register | Loaves Fishes Computers",
                success: false,
                message: "An account with that email already exists",
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password
            });
            // ELSE CREATE A NEW USER
        } else {
            // Bcrypt Password
            const token = randomString.generate(20);
            const hash = await bcrypt.hash(password, saltRounds);
            // INSERT INTO user
            const insertResult = await dbService.addUser(first_name, last_name, email, hash, token, member_since);
            // Send MailGun
            await mail.activateAccountEmail(email, insertResult, token);
            res.render("account-verification", {title: "Account Verification | Loaves Fishes Computers"});
        }
    } catch (err) {
        console.log(err.message);
    }
}

// LOGIN -------------------------------------------------------


exports.login = async (req, res) => {
    const {email, password} = req.body;
    // VALIDATE THAT EMAIL AND/OR PASSWORD ARE NOT EMPTY STRINGS
    if(!email || !password){
        return res.status(400).render("login", {
            title:"Login | Loaves Fishes Computers",
            success: false,
            message: "Please provide a username and password"
        })
    }
    try {
        let fetchResult = await dbService.findUserByEmail(email);
        // IF EMAIL IS NOT IN THE DATABASE OR PASSWORDS DO NOT MATCH
        if (fetchResult === undefined || !(await bcrypt.compare(password, fetchResult.password.toString()))){
            return res.status(401).render("login", {title:"Login | Loaves Fishes Computers", success: false,  message: "Email or password is incorrect"});
        // ELSE IF ACCOUNT IS INACTIVE
        } else if (fetchResult.status === "Inactive"){
            return res.render("login", {title: "Login | Loaves Fishes Computers", success: false, message: "This account is not verified"});
        } else if (fetchResult.status === "Active"){
            const token = jwt.sign({ id: fetchResult.id}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            }
            res.cookie("jwt", token, cookieOptions);
            return res.status(200).redirect("/");
        }
    } catch (err){
        console.log(err.message);
    }
}


// IS USER LOGGED IN? -------------------------------------------------------


exports.isLoggedIn = async (req, res, next) => {
    if(req.cookies.jwt){
        try{
            //1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            //2.) check if the user still exists
            const result = await dbService.findUserById(decoded.id);

            if(!result){
                return next();
            }
            req.user = result;
            return next();

        }catch(err){
            return next();
        }
    }else{ next();}
}



// LOGOUT -------------------------------------------------------


exports.logout = async (req, res) => {
    res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
    return res.status(200).redirect("/");
}


// UPDATE PASSWORD -------------------------------------------------------


exports.updatePassword = async (req, res) => {
    const { id, token, token_expires, password } = req.body;

    // CHECK THAT TOKEN IS NOT EXPIRED
    if(token_expires > Date.now()){
        // GRAB ANY ERRORS FROM EXPRESS VALIDATOR
        const errors = validationResult(req);
        // STRINGIFY TO PARSE THE DATA
        const allErrors = JSON.stringify(errors);
        const allParsedErrors = JSON.parse(allErrors);
        // OUTPUT VALIDATION ERRORS IF ANY
        if(!errors.isEmpty()){
            return res.render("password-reset-update", {
                title: "Password Reset Update | Loaves Fishes Computers",
                allParsedErrors: allParsedErrors,
                token: token,
                token_expires: token_expires,
                id: id,
                token_success: true
            })
        }
        // UPDATE THE PASSWORD
        try {
            // Bcrypt Password
            const hash = await bcrypt.hash(password, saltRounds);
            const data = { token: null, token_expires: null, password: hash};
            await dbService.setUserDataById(data, id)
            return res.render("password-reset-success", {title: "Password Reset Success  | Loaves Fishes Computers"});
        } catch (err) {
            console.log(err.message);
        }
    } else {
        return res.render("password-reset-update", {title: "Password Reset Update | Loaves Fishes Computers", token_success: false, message: "Password reset token is invalid or has expired" });
    }
}


// PASSWORD RESET -------------------------------------------------------


exports.passwordReset = async (req, res) => {
    let email = req.body.email;
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*\.[a-z]{2,4}$/;

    // CHECK FOR EMAIL VALIDATION
    if (!email || !pattern.test(email)) {
        let message = !email ? "Email field cannot be empty" : "Email is invalid";
        return res.render("password-reset", {
            title: "Password Reset | Loaves Fishes Computers",
            success: false,
            message: message
        });
    }
    // CHECK IF EMAIL EXISTS
    try {
        let result = await dbService.findUserByEmail(email);
        let token = randomString.generate(20);
        const token_expires = Date.now() + 3600000;
        const data = {token: token, token_expires: token_expires};

        await dbService.setUserDataById(data, result.id);
        mail.resetPasswordEmail(email, result.id, token);

    } catch (err) {
        console.log(err.message)
    }

    return res.render("password-reset-sent", {title: "Password Reset Sent | Loaves Fishes Computers"});
}

// SUBMIT VOLUNTEER FORMS -------------------------------------------------------


exports.submitForms = async (req, res) => {
    try{
        // PREPARE SERIALIZED PDF BYTEARRAY FROM BODY ELEMENTS
        const pdfBytes =  await pdfService.readyForm(req.body,"pdf/LFC_Forms_Edit_Version.pdf")

        // CREATE FILE USING BUFFER
        const filename = `LFC_Forms_Volunteer_Copy_${Date.now()}`;
        await fs.writeFile(`user-forms/${filename}.pdf`, pdfBytes)
        console.log(`=================================\nStep 1: File created: 'user-forms/${filename}.pdf'`);

        // // UPLOAD THE PDF TO AWS
        // await s3.uploadPDF(req.user.id, filename);
        // console.log("Step 2: Uploaded new PDF to Amazon S3");
        //
        // // IF THE USER HAD PREVIOUSLY SUBMITTED A FORM, DELETE IT FROM AWS
        // if (req.user.forms != null) {
        //     await s3.deleteForms(req.user.id, req.user.forms);
        //     console.log("Step 3: Deleted old PDF from AWS")
        // }

        // UPDATE THE FORM RECORD IN THE DATABASE
        await dbService.setUserDataById({forms: filename}, req.user.id)
        console.log(`Step 4: Database record ${req.user.id}'s 'forms' field updated to '${filename}'`)

        // REMOVE THE PDF FROM THE USER-FORMS FOLDER
        await fs.unlink(`user-forms/${filename}.pdf`)
        console.log(`Step 5: Deleted '${filename}.pdf' from local directory 'user-forms/'`)

        res.redirect("/dashboard");

    } catch (err) {
        console.error(err.message)
    }
}


// PROFILE EDIT -------------------------------------------------------


exports.profileEdit = async (req, res) => {
    let formData = {
        image: req.user.image,
        motivational_statement: req.body.motivational_statement,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        birthday: req.body.birthday,
        place_of_birth: req.body.place_of_birth,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone,
        other_email: req.body.other_email,
        emergency_first_name: req.body.emergency_first_name,
        emergency_last_name: req.body.emergency_last_name,
        emergency_relation: req.body.emergency_relation,
        emergency_phone: req.body.emergency_phone,
        job1_company: req.body.job1_company,
        job1_title: req.body.job1_title,
        job1_years: req.body.job1_years,
        job1_duties: req.body.job1_duties,
        job2_company: req.body.job2_company,
        job2_title: req.body.job2_title,
        job2_years: req.body.job2_years,
        job2_duties: req.body.job2_duties,
        skills: req.body.skills,
        languages: req.body.languages
    };

    const image = req.file;
    let success = false;
    let message = "";
    let user = req.user;

    try{
        // CHECK IMAGE VALIDITY
        if (image && ["image/jpeg", "image/png", "image/jpg"].includes(image.mimetype) && image.size < 1000000) {
            // UPLOAD THE IMAGE TO AMAZON S3, DELETING OLD
            if (user.image != null) {
                await s3.deleteImage(user.id, user.image);
            }

            await s3.uploadImage(user.id, image);
            formData.image = image.filename;

            // UPDATE DATABASE RECORD
            user = await dbService.setUserDataById(formData, user.id);
            success = true;
            message = "Update success";
            await fs.unlink(image.path);
        } else if (image) {
            message = image.size >= 1000000 ? "Image size is too large" : "Image type is unsupported";
            await fs.unlink(image.path);
        } else {
            user = await dbService.setUserDataById(formData, req.user.id);
            success = true;
            message = "Update success";
        }
        return res.render("profile-edit", {title: "Profile Edit | Loaves Fishes Computers", success: success, message : message, user : user});

    } catch (err){
        console.error(err.message)
    }
}


// DELETE ACCOUNT ------------------------------------------------------------------


exports.deleteAccount = async (req, res) => {
    const password = req.body.password;

    if (!password)
        return res.status(401).render("dashboard", {
            title: "Dashboard | Loaves Fishes Computers",
            user: req.user,
            success: false,
            message: "Input field cannot be empty"
        });

    try{
        const user = await dbService.findUserById(req.user.id)
        if (await bcrypt.compare(password, user.password.toString())){
            await dbService.deleteUserById(req.user.id)
            res.cookie("jwt", "logout", {
                expires: new Date(Date.now() + 2 * 1000),
                httpOnly: true
            });
            res.redirect("/");
        }else{
            return res.status(401).render("dashboard", {
                title: "Dashboard | Loaves Fishes Computers",
                user: req.user,
                success: false,
                message: "The password is incorrect"
            });
        }
    } catch (err) {
        console.error(err.message)
    }
}

// EMAIL HELPER -------------------------------------------------------
const emailHelper = async (page, req) => {
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    const { name, email, content } = req.body;

    const titles = {
        "contact": "Contact | Loaves Fishes Computers",
        "index": "Home | Loaves Fishes Computers",
        "mission": "Mission | Loaves Fishes Computers",
        "recruitment": "Recruitment | Loaves Fishes Computers"
    };

    // Set title using the mapping object or default to an empty string
    const title = titles[page] || "";

    // Validate inputs
    if (!name || !email || !content) {
        return { title, user: req.user, success: false, message: "Input fields cannot be empty" };
    } else if (!pattern.test(email)) {
        return { title, user: req.user, success: false, message: "Email is invalid" };
    }

    // Send email | Should be combined (in mail.js too)
    if (page === "contact") {
        await mail.contactUsEmail(name, email, content);
    } else {
        await mail.sendApplyEmail(name, content, email);
    }
    return { title, user: req.user, success: true, message: "Message has been sent" };
};


// CONTACT US (CONTACT PAGE) -------------------------------------------------------

exports.contactUsEmail = (req, res) => {
    return res.render("contact", emailHelper("contact", req));
}

// APPLY TO VOLUNTEER (HOME PAGE) -------------------------------------------------------

exports.applyEmailHome = (req, res) => {
    return res.render("index", emailHelper("index", req));
};

// APPLY TO VOLUNTEER (MISSION PAGE) -------------------------------------------------------

exports.applyEmailMission = (req, res) => {
    return res.render("mission", emailHelper("mission", req));
};

// APPLY TO VOLUNTEER (RECRUITMENT PAGE) -------------------------------------------------------

exports.applyEmailRecruitment = (req, res) => {
    return res.render("recruitment", emailHelper("recruitment", req));
};


// ADMIN CRUD SYSTEM ======================================================================================


// FIND USER -------------------------------------------------------


exports.findUser = async (req, res) => {
    try{
        const results = await dbService.findUsersBySearch(req.body.search);
        return res.render("admin", {title: "Admin | Loaves Fishes Computers", user: req.user, rows: results})
    } catch (err) {
        console.error(err);
    }
}


// ADD USER -------------------------------------------------------


exports.addUser = async (req, res) => {
    const {first_name, last_name, password, admin} = req.body;
    const member_since = get_date();
    const status = "Active";
    let email = req.body.email;

    if (email === "@")
        email = undefined;

    // Use express validator to check for errors in user input
    const errors = validationResult(req);

    // Need to stringify and parse to access the data
    const allErrors = JSON.stringify(errors);
    let allParsedErrors = JSON.parse(allErrors);

    // If there are validation errors: return them to the user.
    if (!errors.isEmpty()) {
        return res.render("add-user", {
            title: "Add User",
            user: req.user,
            allParsedErrors: allParsedErrors,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        })
    }

    // If there isn't any validation errors: check if the email is already is in use
    try{
        const result = await dbService.findUserByEmail(email)
        if (result) {
            return res.render("add-user", {
                title: "Add User",
                user: req.user,
                success: false,
                message: "An account with that email already exists",
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password
            });
        } else {
            const hash = bcrypt.hash(password, saltRounds)
            await dbService.addUser(first_name, last_name, email, hash, member_since, status, admin);
            return res.render("add-user", {
                title: "Add User",
                user: req.user,
                success: true,
                message: "User account was created successfully"
            });
        }
    } catch (err) {
        console.error(err)
    }
}


// UPDATE USER -------------------------------------------------------


exports.updateUser = async (req, res) => {
    const {first_name, last_name, admin} = req.body;
    let email = req.body.email;
    if (email === "@")
        email = undefined;

    try {
        const data = {first_name: first_name, last_name: last_name, email: email, admin: admin};
        const result = await dbService.setUserDataById(data, req.params.id);
        return res.render("edit-user", {
            title: "Edit User",
            user: req.user,
            success: true,
            message: "User has been updated",
            rows: result
        });
    } catch (err) {
        console.error(err)
    }
}


