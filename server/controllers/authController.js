const mysql = require("mysql2");
const dbService = require("../../services/dbService.js")
const db = require("../repository/db.js");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const {validationResult} = require("express-validator");
const randtoken = require("rand-token");
var randomstring = require("randomstring");
const mail = require("../../services/mail.js");
const s3 = require("../../services/s3.js");
const { createPDF } = require("../../services/pdf.js");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const bcrypt = require("bcrypt");
const saltRounds = 10;
var path = require("path");
require("dotenv").config();
// POST ROUTES CONTROLLER ========================================


// GRAB THE CURRENT DATE FUNCTION --------------------------------

function get_date(){
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - (offset*60*1000));
    return yourDate.toISOString().split('T')[0]
}


// REGISTER -------------------------------------------------------


exports.register = (req, res) => {
    const { first_name, last_name, email, password, password_confirm } = req.body;
    const member_since = get_date();

    // GRAB ANY ERRORS FROM EXPRESS VALIDATOR
    const errors = validationResult(req);
    // STRINGIFY TO PARSE THE DATA
    const allErrors = JSON.stringify(errors);
    const allParsedErrors = JSON.parse(allErrors);
    // OUTPUT VALIDATION ERRORS IF ANY
    if(!errors.isEmpty()){
        return res.render("register", {
            title: "Register | Loaves Fishes Computers",
            allParsedErrors: allParsedErrors,
            first_name : first_name,
            last_name : last_name,
            email : email,
            password : password
        })
    }

    db.query("SELECT email FROM user WHERE email = ?", [email], async (err, results) => {
        // CHECK IF EMAIL ALREADY EXISTS IN DATABASE
        if (!err && results != "") {
            return res.render("register", {title: "Register | Loaves Fishes Computers",
                success: false,
                message: "An account with that email already exists",
                first_name : first_name,
                last_name : last_name,
                email: email,
                password: password});
            // ELSE CREATE A NEW USER
        } else if(!err && results[0] === undefined){
            var token = randomstring.generate(20);
            bcrypt.hash(password, saltRounds, (err, hash) => {
                db.query("INSERT INTO user (first_name, last_name, email, password, token, member_since) VALUES (?,?,?,?,?,?)", [first_name, last_name, email, hash, token, member_since],
                    async (err, results) => {
                        if (!err) {
                            mail.activateAccountEmail(email, results.insertId, token, (err, data) => {
                                if(!err) return res.render("account-verification", {title: "Account Verification | Loaves Fishes Computers"});
                                else console.log(err.message)
                            });
                            // DATABASE ERROR
                        } else console.log(err.message);
                    })//function
            });//bcrypt
            // DATABASE ERROR
        } else console.log(err.message);
    });
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

    db.query("SELECT * FROM user WHERE email = ?", [email], async (err, results) => {
        // IF EMAIL IS NOT IN THE DATABASE OR PASSWORDS DO NOT MATCH
        if(!err && (results == "" || !(await bcrypt.compare(password, results[0].password.toString())))){
            return res.status(401).render("login", {title:"Login | Loaves Fishes Computers", success: false,  message: "Email or password is incorrect"});
            // ELSE IF ACCOUNT IS INACTIVE
        } else if (!err && results[0].status === "Inactive") {
            return res.render("login", {title: "Login | Loaves Fishes Computers", success: false, message: "This account is not verified"});
            // ELSE ALLOW USER TO LOGIN
        } else if (!err && results[0].status === "Active"){
            const id = results[0].id;
            const token = jwt.sign({ id: id}, process.env.JWT_SECRET, {
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
            // DATABASE ERROR
        } else console.log(err.message);
    });
}


// IS USER LOGGED IN? -------------------------------------------------------


exports.isLoggedIn = async (req, res, next) => {
    if(req.cookies.jwt){
        try{
            //1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            //2.) check if the user still exists
            db.query("SELECT * FROM user WHERE id = ?", [decoded.id], (err, result) => {
                if(!result){
                    return next();
                }
                req.user = result[0];
                return next();
            })
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


exports.updatePassword = (req, res) => {
    const { id, token, token_expires, password } = req.body;

    // CHECK THAT TOKEN IS NOT EXPIRED
    if(token_expires > Date.now()){
        // GRAB ANY ERRORS FROM EXPRESS VALIDATOR
        const errors = validationResult(req);
        // STRINGIFY TO PARSE THE DATA
        var allErrors = JSON.stringify(errors);
        var allParsedErrors = JSON.parse(allErrors);
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
        bcrypt.hash(password, saltRounds, (err, hash) => {
            var data = { token: null, token_expires: null, password: hash};
            db.query("UPDATE user SET ? WHERE id = ?", [data, id], (err, result) => {
                if(!err) return res.render("password-reset-success", {title: "Password Reset Success  | Loaves Fishes Computers"});
                else console.log(err.message);
            });
        });
    } else {
        return res.render("password-reset-update", {title: "Password Reset Update | Loaves Fishes Computers", token_success: false, message: "Password reset token is invalid or has expired" });
    }
}


// PASSWORD RESET -------------------------------------------------------


exports.passwordReset = (req, res) => {
    var email = req.body.email;
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;

    // CHECK FOR EMAIL VALIDATION
    if(
        email === undefined ||
        email === "" ||
        email === null
    ){
        return res.render("password-reset", {title: "Password Reset | Loaves Fishes Computers", success: false, message : "Email field cannot be empty"})
    } else if(!pattern.test(email)){
        return res.render("password-reset", {title: "Password Reset | Loaves Fishes Computers", success: false, message : "Email is invalid"})
    }

    // CHECK IF EMAIL EXISTS
    db.query("SELECT id, email FROM user WHERE email = ?", [email] , (err, results) => {
        // EMAIL FOUND
        if(!err && results[0] != undefined) {
            var id = results[0].id;
            // GENERATE TOKEN
            var token = randomstring.generate(20);
            // SET EXPIRATION DATE
            const token_expires = Date.now() + 3600000;
            const data = { token: token, token_expires: token_expires};
            // SEND USER EMAIL TO RESET PASSWORD
            db.query("UPDATE user SET ? WHERE email = ?", [data, email], (err, results) => {
                if(!err) {
                    mail.resetPasswordEmail(email, id, token, (err, data) => {
                        if(!err) return res.render("password-reset-sent", {title: "Password Reset Sent | Loaves Fishes Computers"});
                        else console.log(err.message);
                    });
                    // DATABASE ERROR
                } else console.log(err.message);
            });
            // EMAIL WAS NOT FOUND (USER DOES NOT EXIST)
        } else if(!err && results[0] === undefined) {
            return res.render("password-reset-sent", {title: "Password Reset Sent | Loaves Fishes Computers"});
            // DATABASE ERROR
        } else {
            console.log(err.message)
        }
    });
}


// SUBMIT VOLUNTEER FORMS -------------------------------------------------------


exports.submitForms = async (req, res) => {

    var filename = `LFC_Forms_Volunteer_Copy_${Date.now()}.pdf`;
    const {form1_volunteer_name, form1_volunteer_date, form1_volunteer_signature, form1_parent_name, form1_parent_date, form1_parent_signature } = req.body;
    const {form2_volunteer_name, form2_volunteer_date, form2_volunteer_signature} = req.body;
    const {form3_volunteer_name, form3_volunteer_date, form3_volunteer_goal, form3_volunteer_signature} = req.body;
    const {form4_volunteer_initials, form4_volunteer_name, form4_volunteer_date, form4_volunteer_signature, form4_parent_name, form4_child_name, form4_parent_date, form4_parent_signature} = req.body;
    const {form5_volunteer_yes_no, form5_volunteer_name, form5_volunteer_address, form5_volunteer_phone, form5_volunteer_date, form5_volunteer_signature, form5_parent_signature, form5_staff_notes} = req.body;


    // CREATE PDF BUFFER
    const pdfBytes = await createPDF(filename,
        form1_volunteer_name, form1_volunteer_date, form1_volunteer_signature, form1_parent_name, form1_parent_date, form1_parent_signature,
        form2_volunteer_name, form2_volunteer_date, form2_volunteer_signature,
        form3_volunteer_name, form3_volunteer_date, form3_volunteer_goal, form3_volunteer_signature,
        form4_volunteer_initials, form4_volunteer_name, form4_volunteer_date, form4_volunteer_signature, form4_parent_name, form4_child_name, form4_parent_date, form4_parent_signature,
        form5_volunteer_yes_no, form5_volunteer_name, form5_volunteer_address, form5_volunteer_phone, form5_volunteer_date, form5_volunteer_signature, form5_parent_signature, form5_staff_notes).catch(err => console.log("Was it this error?   " + err.message));

    // CREATE PDF FILE WITH BUFFER
    fs.writeFile(`user-forms/${filename}`, pdfBytes, (err) => {
        if (!err) {
            console.log("=================================\nStep 1: PDF file was created");

            // UPLOAD THE PDF TO AWS
            s3.uploadPDF(req.user.id, filename);
            console.log("Step 2: Uploaded new PDF to AWS");

            // IF THE USER HAD PREVIOUSLY SUBMITTED A FORM, DELETE IT FROM AWS
            if(req.user.forms != null){
                s3.deleteForms(req.user.id, req.user.forms);
                console.log("Step 3: Deleted old PDF from AWS")
            }

            // REMOVE THE PDF FROM THE USER-FORMS FOLDER
            let DIR = "user-forms/";
            fs.readdir(DIR, (err, filesInDirectory) => {
                if (err) console.log(err.message);

                if(filesInDirectory != ""){
                    for (let file of filesInDirectory) {
                        fs.unlinkSync(DIR + file)
                        console.log("Step 4: Removed PDF from local folder")
                    }
                }
            })

            // UPDATE THE FORM RECORD IN THE DATABASE
            db.query("UPDATE user SET forms = ? WHERE id = ?", [filename, req.user.id], (err, result) => {
                if(!err) res.redirect("/dashboard");
                else console.log(err.message)
            });
        } else { console.log("Or was it this error again:  " + err.message)}
    });
}


// PROFILE EDIT -------------------------------------------------------


exports.profileEdit = async (req, res, next) => {
    const { motivational_statement, first_name, last_name, gender, birthday, place_of_birth, street, city, state, phone, other_email, emergency_first_name, emergency_last_name, emergency_relation, emergency_phone, job1_company, job1_title, job1_years, job1_duties, job2_company, job2_title, job2_years, job2_duties, skills, languages } = req.body;
    const image = req.file;

    // CHECK IF USER UPLOADED AN IMAGE AND IF IT'S A VALID TYPE
    if(image && (image.mimetype === "image/jpeg" || image.mimetype === "image/png" || image.mimetype === "image/jpg")){
        // CHECK THAT THE IMAGE SIZE IS LESS THAN 1MG
        if(image.size < 1000000) {
            // UPLOAD THE IMAGE TO AWS
            const result = await s3.uploadImage(req.user.id, image);
            // REMOVE THE FILE FROM THE UPLOADS FOLDER
            await unlinkFile(image.path);
            // IF THE USER HAD PREVIOUSLY UPLOADED AN IMAGE, DELETE IT FROM AWS
            if(req.user.image != null)
                s3.deleteImage(req.user.id, req.user.image);
            // UPDATE THE USER IMAGE ALONG WITH ANY OTHER UPDATES THE USER MADE TO THEIR PROFILE
            db.query("UPDATE user SET image = ?, motivational_statement = ?, first_name = ?, last_name = ?, gender = ?, birthday = ?, place_of_birth = ?, street = ?, city = ?, state = ?, phone = ?, other_email = ?, emergency_first_name = ?, emergency_last_name = ?, emergency_relation = ?, emergency_phone = ?, job1_company = ?, job1_title = ?, job1_years = ?, job1_duties = ?, job2_company = ?, job2_title = ?, job2_years = ?, job2_duties = ?, skills = ?, languages = ? WHERE id = ?",
                [image.filename, motivational_statement, first_name, last_name, gender, birthday, place_of_birth, street, city, state, phone, other_email, emergency_first_name, emergency_last_name, emergency_relation, emergency_phone, job1_company, job1_title, job1_years, job1_duties, job2_company, job2_title, job2_years, job2_duties, skills, languages, req.user.id], (err, result) => {
                    if(!err){
                        // QUERY TO SELECT AND RETURN THE UPDATES TO THE USER
                        db.query("SELECT * FROM user WHERE id = ? ", [req.user.id], (err, result) => {
                            if(!err) return res.render("profile-edit", {title: "Profile Edit | Loaves Fishes Computers", success: true, message : "Update success", user : result[0]});
                            else console.log(err);
                        });
                        // DATABASE ERROR
                    } else { console.log(err) }
                });
            // FILE SIZE ERROR
        } else {
            await unlinkFile(image.path);
            return res.render("profile-edit", {title: "Profile Edit | Loaves Fishes Computers", success: false, message : "Image size is too large", user : req.user});
        }
        // UNSUPPORTED IMAGE TYPE
    }else if(image && (image.mimetype != "image/jpeg" || image.mimetype != "image/png" || image.mimetype != "image/jpg")){
        await unlinkFile(image.path);
        return res.render("profile-edit", {title: "Profile Edit | Loaves Fishes Computers", success: false, message : "Image type is unsupported", user : req.user});

        // NO IMAGE UPLOADED/UPDATED BY USER
    } else {
        db.query("UPDATE user SET motivational_statement = ?, first_name = ?, last_name = ?, gender = ?, birthday = ?, place_of_birth = ?, street = ?, city = ?, state = ?, phone = ?, other_email = ?, emergency_first_name = ?, emergency_last_name = ?, emergency_relation = ?, emergency_phone = ?, job1_company = ?, job1_title = ?, job1_years = ?, job1_duties = ?, job2_company = ?, job2_title = ?, job2_years = ?, job2_duties = ?, skills = ?, languages = ? WHERE id = ?", [motivational_statement, first_name, last_name, gender, birthday, place_of_birth, street, city, state, phone, other_email, emergency_first_name, emergency_last_name, emergency_relation, emergency_phone, job1_company, job1_title, job1_years, job1_duties, job2_company, job2_title, job2_years, job2_duties, skills, languages, req.user.id], (err, result) => {
            if(!err) {
                db.query("SELECT * FROM user WHERE id = ?",[req.user.id], (err, result) => {
                    if(!err) return res.render("profile-edit", {title: "Profile Edit | Loaves Fishes Computers", success: true, message : "Update success", user : result[0]});
                    else console.log(err);
                });
            } else {
                console.log(err)
            }
        });
    }
}


// DELETE ACCOUNT ------------------------------------------------------------------


exports.deleteAccount = (req, res) => {
    const password = req.body.password;

    if(password === "" || password === null || password === undefined)
        return res.status(401).render("dashboard", {title:"Dashboard | Loaves Fishes Computers",  user : req.user, success: false,  message: "Input field cannot be empty"});

    db.query("SELECT password FROM user WHERE id = ?", [req.user.id], async (err, results) => {
        // IF PASSWORDS MATCH
        if(!err && (await bcrypt.compare(password, results[0].password.toString()))){
            db.query("UPDATE user SET email = ?, status = ? WHERE id = ?", [null, "Deleted", req.user.id], async (err, results) => {
                if(!err) {
                    res.cookie("jwt", "logout", {
                        expires: new Date(Date.now() + 2*1000),
                        httpOnly: true
                    });
                    res.redirect("/");
                }
                else console.log(err.message);
            })
            // IF PASSWORDS DO NOT MATCH
        } else if(!err && !(await bcrypt.compare(password, results[0].password.toString()))) {
            return res.status(401).render("dashboard", {title:"Dashboard | Loaves Fishes Computers",  user : req.user, success: false,  message: "The password is incorrect"});
            // DATABASE ERROR
        } else { console.log(err.message); }
    });
}


// CONTACT US (CONTACT PAGE) -------------------------------------------------------


exports.contactUsEmail = (req, res) => {
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    const {name, email, message} = req.body;
    console.log(email)
    if(
        name === "" || name === null || name === undefined ||
        email === "" || email === null || email === undefined ||
        message === "" || message === null || message === undefined){
        return res.render("contact", {title: "Contact | Loaves Fishes Computers", user : req.user, success: false, message: "Input fields cannot be empty"});
    } else if(!pattern.test(email)) {
        return res.render("contact", {title: "Contact | Loaves Fishes Computers", user : req.user, success: false, message: "Email is invalid"});
    }
    mail.contactUsEmail(name, email, message, (err, data) => {
        if (!err) return res.render("contact", {title: "Contact | Loaves Fishes Computers", user : req.user, success: true, message: "Message has been sent"});
        else console.log(err)
    });
}


// APPLY TO VOLUNTEER (HOME PAGE) -------------------------------------------------------


exports.applyEmailHome = (req, res) => {
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    const { full_name, phone, email } = req.body;
    if(
        full_name === "" || full_name === null || full_name === undefined ||
        phone === "" || phone === null || phone === undefined ||
        email === "" || email === null || email === undefined){
        return res.render("index", {title: "Home | Loaves Fishes Computers", user : req.user, success: false, message: "Input fields cannot be empty"});
    } else if(!pattern.test(email)) {
        return res.render("index", {title: "Home | Loaves Fishes Computers", user : req.user, success: false, message: "Email is invalid"});
    }
    mail.sendApplyEmail(full_name, phone, email, (err, data) => {
        if (!err) return res.render("index", {title: "Home | Loaves Fishes Computers", user : req.user, success: true, message: "Message has been sent"});
        else console.log(err);
    });

};


// APPLY TO VOLUNTEER (MISSION PAGE) -------------------------------------------------------


exports.applyEmailMission = (req, res) => {
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    const { full_name, phone, email } = req.body;
    if(
        full_name === "" || full_name === null || full_name === undefined ||
        phone === "" || phone === null || phone === undefined ||
        email === "" || email === null || email === undefined){
        return res.render("mission", {title: "Mission | Loaves Fishes Computers", user : req.user, success: false, message: "Input fields cannot be empty"});
    }else if(!pattern.test(email)) {
        return res.render("mission", {title: "Mission | Loaves Fishes Computers", user : req.user, success: false, message: "Email is invalid"});
    }
    mail.sendApplyEmail(full_name, phone, email, (err, data) => {
        if (!err) return res.render("mission", {title: "Mission | Loaves Fishes Computers", user : req.user, success: true, message: "Message has been sent"});
        else console.log(err);
    });
};


// APPLY TO VOLUNTEER (RECRUITMENT PAGE) -------------------------------------------------------


exports.applyEmailRecruitment = (req, res) => {
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    const { full_name, phone, email } = req.body;
    if(
        full_name === "" || full_name === null || full_name === undefined ||
        phone === "" || phone === null || phone === undefined ||
        email === "" || email === null || email === undefined){
        return res.render("recruitment", {title: "Recruitment | Loaves Fishes Computers", user : req.user, success: false, message: "Input fields cannot be empty"});
    }else if(!pattern.test(email)) {
        return res.render("recruitment", {title: "Home | Loaves Fishes Computers", user : req.user, success: false, message: "Email is invalid"});
    }
    mail.sendApplyEmail(full_name, phone, email, (err, data) => {
        if (!err) return res.render("recruitment", {title: "Recruitment | Loaves Fishes Computers", user : req.user, success: true, message: "Message has been sent"});
        else console.log(err);
    });
};



// ADMIN CRUD SYSTEM ======================================================================================


// FIND USER -------------------------------------------------------


exports.findUser = (req, res) => {
    let searchTerm = req.body.search;
    db.query("SELECT * FROM user WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) && status != 'Deleted'", ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"], (err, rows) => {
        if(!err) return res.render("admin", {title: "Admin | Loaves Fishes Computers" , user : req.user, rows: rows});
        else console.log(err);
    });
}


// ADD USER -------------------------------------------------------


exports.addUser = (req, res) => {
    const { first_name, last_name, password, password_confirm, admin } = req.body;
    const member_since = get_date();
    const status = "Active";
    var email = req.body.email;

    if(email === "@")
        email = undefined;

    // Use express validator to check for errors in user input
    const errors = validationResult(req);

    // Need to stringify and parse to access the data
    var allErrors = JSON.stringify(errors);
    var allParsedErrors = JSON.parse(allErrors);

    // If there are validation errors: return them to the user.
    if(!errors.isEmpty()){
        return res.render("add-user", {
            title:"Add User",
            user : req.user,
            allParsedErrors: allParsedErrors,
            first_name : first_name,
            last_name : last_name,
            email: email,
            password: password
        })
    }

    // If there isn't any validation errors: check if the email is already is in use
    db.query("SELECT * FROM user WHERE email = ?", [email], async (err, results) => {
        // Technical error
        if (err) {
            console.log(err);
            // Email already exists
        } else if (results != ""){
            return res.render("add-user", {title: "Add User",
                user : req.user,
                success: false,
                message: "An account with that email already exists",
                first_name : first_name,
                last_name : last_name,
                email: email,
                password: password});
            // Create account
        } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                db.query("INSERT INTO user (first_name, last_name, email, password, member_since, status, admin) VALUES (?,?,?,?,?,?,?)", [first_name, last_name, email, hash, member_since, status, admin],
                    async (err, results) => {
                        if (!err) return res.render("add-user", {title: "Add User", user : req.user, success: true, message: "User account was created successfully"});
                        else console.log(err)
                    })// db function
            });//bcrypt
        }
    })
}


// UPDATE USER -------------------------------------------------------


exports.updateUser = (req, res) => {
    const { first_name, last_name, admin } = req.body;
    var email = req.body.email;
    if(email === "@")
        email = undefined;

    db.query("UPDATE user SET first_name = ?, last_name = ?, email = ?, admin = ? WHERE id = ?", [first_name, last_name, email, admin, req.params.id],
        async (err, results) => {
            if (!err) {
                db.query("SELECT * FROM user WHERE id = ?",[req.params.id], (err, rows) => {
                    if(!err) return res.render("edit-user", {title: "Edit User", user : req.user, success: true, message: "User has been updated", rows: rows});
                    else console.log(err);
                });
            } else {
                console.log(err);
            }
        })// db function
}
