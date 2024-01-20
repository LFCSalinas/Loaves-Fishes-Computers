const express = require("express");
const dbService = require("../../services/dbService.js")

const authController = require("../controllers/newController")
const s3 = require("../../services/s3.js");
const router = express.Router();


// FUNCTION TO CHECK FOR INTERNET EXPLORER ============================================

function browserInvalid(headers){
  const ba = ["Chrome", "Firefox", "Safari", "Opera", "MSIE", "Trident", "Edge"];
  let b, ua = headers['user-agent'];
  for(let i=0; i < ba.length; i++){
    if(ua.indexOf(ba[i]) > -1){
      b = ba[i];
      break;
    }
  }
  // IF INTERNET EXPLORER IS BEING USED RETURN TRUE OTHERWISE RETURN FALSE
  return (b === "MSIE" || b === "Trident");
}

function isLoggedIn(user){
  return !!(user)
}

function isAdmin(user){
  return (user.admin !== "Yes")
}


// GET ROUTES ==============================================================


router.get("/", authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers))
    return res.render("unsupported", {title: "Home | Loaves Fishes Computers", user : req.user});
  return res.render("index", {title: "Home | Loaves Fishes Computers", user : req.user});
});

// USER MUST NOT BE LOGGED IN TO USE THESE ROUTES

router.get("/register", authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers) || isLoggedIn(req.user))
    return res.redirect("/");
  return res.render("register", {title: "Register | Loaves Fishes Computers", user : req.user});
});

router.get("/login", authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers) || isLoggedIn(req.user))
    return res.redirect("/");
  return res.render("login", {title: "Login | Loaves Fishes Computers", user : req.user});
});

router.get("/password-reset", authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers) || isLoggedIn(req.user))
    return res.redirect("/");
  return res.render("password-reset", {title: "Password Reset | Loaves Fishes Computers", user : req.user} );
});

router.get("/account-verification-message/:id:token", authController.isLoggedIn, async (req, res) => {
  // Log the user out for security reasons
  if(browserInvalid(req.headers) || isLoggedIn(req.user)){
    res.cookie("jwt", "logout", {
      expires: new Date(Date.now() + 2*1000),
      httpOnly: true
    });
    return res.status(200).redirect("/");
  }

  // Check that the user exists
  try {
    const result = await dbService.findUserById(req.params.id);
    if (!result.token) {
      return res.render("account-verification-message", {title: "Account Verification Message | Loaves Fishes Computers", user : req.user, message: "Your account is already active please login."} );
    }
    if (req.params.token === result.token.toString()){
      await dbService.activateUserById(result.id);
      return res.render("account-verification-message", {title: "Account Verification Message | Loaves Fishes Computers", user : req.user, success: true, message: "Account has been successfully verified."} );
    }
    return res.render("account-verification-message", {title: "Account Verification Message | Loaves Fishes Computers", user : req.user, message: "Authentication token is invalid or has expired."} );
  } catch (err) {
    console.error(err)
  }
});

router.get("/password-reset-update/:id:token", authController.isLoggedIn, async (req, res) => {
  // Log the user out for security reasons
  if(browserInvalid(req.headers) || isLoggedIn(req.user)){
    res.cookie("jwt", "logout", {
      expires: new Date(Date.now() + 2*1000),
      httpOnly: true
    });
    return res.status(200).redirect("/");
  }
  try {
    const results = await dbService.findUserById(req.params.id);
    if (results === "" || results[0].token === null || results[0].token_expires <= Date.now()) {
      return res.render("password-reset-update", {title: "Password Reset Update", user : req.user, token_success: false, message: "Password reset token is invalid or has expired."} );
    }
    if (req.params.token === results.token.toString()) {
      return res.render("password-reset-update", {title: "Password Reset Update", user : req.user, id: req.params.id, token: req.params.token, token_expires: results[0].token_expires, token_success: true} );
    }
  } catch (err) {
    console.error(err)
  }
})


// USER MUST BE LOGGED IN TO USE THESE ROUTES

router.get("/dashboard", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isLoggedIn(req.user))
    return res.redirect("/login");
  return res.render("dashboard", {title: "Dashboard |  Loaves Fishes Computers", user : req.user} );
});

router.get("/image/:key", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isLoggedIn(req.user))
    return res.redirect("/login");
  const readStream = s3.getImageStream(req.user.id, req.user.image);
  readStream.pipe(res);
});

router.get("/profile", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isLoggedIn(req.user))
    return res.redirect("/login");
  return res.render("profile", {title: "Profile |  Loaves Fishes Computers", user : req.user} );
});

router.get("/profile-edit", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isLoggedIn(req.user))
    return res.redirect("/login");
  return res.render("profile-edit", {title: "Profile Edit |  Loaves Fishes Computers", user : req.user} );
});

router.get("/volunteer-age", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isLoggedIn(req.user))
    return res.redirect("/login");
  return res.render("volunteer-age", {title: "Volunteer Age |  Loaves Fishes Computers", user : req.user} );
});

router.get("/forms-over-18", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isLoggedIn(req.user))
    return res.redirect("/login");
  return res.render("forms-over-18", {title: "Forms |  Loaves Fishes Computers", user : req.user} );
});

router.get("/forms-under-18", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isLoggedIn(req.user))
    return res.redirect("/login");
  return res.render("forms-under-18", {title: "Forms |  Loaves Fishes Computers", user : req.user} );
});

router.get("/mission",  authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers))
    return res.redirect("/login");
  return res.render("mission", {title: "Mission |  Loaves Fishes Computers", user : req.user});
});

router.get("/recruitment", authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers))
    return res.redirect("/login");
  return res.render("recruitment", {title: "Recruitment |  Loaves Fishes Computers", user : req.user});
});

router.get("/staff", authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers))
    return res.redirect("/login");
  return res.render("staff", {title: "Staff |  Loaves Fishes Computers", user : req.user});
});

router.get("/contact", authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers))
    return res.redirect("/login");
  return res.render("contact", {title: "Contact |  Loaves Fishes Computers", user : req.user});
});


// ADMIN CRUD SYSTEM =======================================================================


// USER MUST BE LOGGED IN AND BE AN ADMIN TO USE THESE ROUTES

router.get("/admin", authController.isLoggedIn, async (req, res) => {
  if (browserInvalid(req.headers) || !isAdmin(req.user)) {
    return res.redirect("/login");
  }

  try {
    const results = await dbService.findAllUsersNotDeleted();
    res.render("admin", {title: "Admin |  Loaves Fishes Computers", user: req.user, rows: results});
  } catch (err) {
    console.error(err)
  }
});

router.get("/user-image/:id/:key", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isLoggedIn(req.user))
    return res.redirect("/login");
  const readStream = s3.getImageStream(req.params.id, req.params.key);
  readStream.pipe(res);
});

router.get("/user-forms/:id/:key", authController.isLoggedIn, (req, res) => {
  if(browserInvalid(req.headers) || !isLoggedIn(req.user)){
    return res.redirect("/login");
  }
  const readStream = s3.getPDFStream(req.params.id, req.params.key);
  readStream.pipe(res);
});

router.get("/add-user", authController.isLoggedIn, (req, res) => {
  if (browserInvalid(req.headers) || !isAdmin(req.user)) {
    return res.redirect("/login");
  }
  return res.render("add-user", {title : "Add User |  Loaves Fishes Computers", user : req.user } );
});

router.get("/edit-user/:id", authController.isLoggedIn, async (req, res) => {
  if (browserInvalid(req.headers) || !isAdmin(req.user)) {
    return res.redirect("/login");
  }
  try {
    const user = await dbService.findUserById(req.params.id);
    return res.render("edit-user", {
      title: "Edit User |  Loaves Fishes Computers",
      user: req.user,
      row: user
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/view-user/:id", authController.isLoggedIn, async (req, res) => {
  if (browserInvalid(req.headers) || !isAdmin(req.user)) {
    return res.redirect("/login");
  }
  try {
    const user = await dbService.findUserById(req.params.id);
    return res.render("view-user", {title: "View User |  Loaves Fishes Computers", user: req.user, row: user});
  } catch (err) {
    console.error(err);
  }
});

router.get("/del-user/:id", authController.isLoggedIn, async (req, res) => {
  if (browserInvalid(req.headers) || !isAdmin(req.user)) {
    return res.redirect("/login");
  }
  try {
    await dbService.deleteUserById(req.params.id)
    return res.redirect("/admin");
  } catch (err) {
    console.error(err);
  }
});


// ERROR 404  =======================================================================================


router.get("*", authController.isLoggedIn, (req, res) => {
  return res.render("error", {title: "Error 404 | Loaves Fishes Computers", user : req.user});
});

module.exports = router;