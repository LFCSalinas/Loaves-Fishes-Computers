var windowLocation = window.location.pathname; 

switch(windowLocation){      
  case "/":
    var indexJS = document.createElement("script");
    indexJS.type = "text/javascript";
    indexJS.src = "/js/index.js";
    document.body.append(indexJS);
    break;
  case "/auth/apply-email-home":
    var indexJS = document.createElement("script");
    indexJS.type = "text/javascript";
    indexJS.src = "/js/apply-email-home.js";
    document.body.append(indexJS);
    break;
  case "/mission":
    var missionJS = document.createElement('script');
    missionJS.type = "text/javascript";
    missionJS.src = "/js/mission.js";
    document.body.append(missionJS);
    break;
  case "/auth/apply-email-mission":
    var missionJS = document.createElement('script');
    missionJS.type = "text/javascript";
    missionJS.src = "/js/apply-email-mission.js";
    document.body.append(missionJS);
    break;
  case "/recruitment":
    var recruitmentJS = document.createElement('script');
    recruitmentJS.type = "text/javascript";
    recruitmentJS.src = "/js/recruitment.js";
    document.body.append(recruitmentJS);
    break;
  case "/auth/apply-email-recruitment":
    var recruitmentJS = document.createElement('script');
    recruitmentJS.type = "text/javascript";
    recruitmentJS.src = "/js/apply-email-recruitment.js";
    document.body.append(recruitmentJS);
    break;
  case "/contact":
    var contactJS = document.createElement('script');
    contactJS.type = "text/javascript";
    contactJS.src = "/js/contact.js";
    document.body.append(contactJS);
    break;
  case "/auth/contact-us-email":
    var contactJS = document.createElement('script');
    contactJS.type = "text/javascript";
    contactJS.src = "/js/contact-email.js";
    document.body.append(contactJS);
    break;
  case "/register":
    var registerJS = document.createElement('script');
    registerJS.type = "text/javascript";
    registerJS.src = "/js/register.js";
    document.body.append(registerJS);
    break;
  case "/auth/register":
    var registerJS = document.createElement('script');
    registerJS.type = "text/javascript";
    registerJS.src = "/js/register.js";
    document.body.append(registerJS);
    break;
  case "/login":
    var loginJS = document.createElement('script');
    loginJS.type = "text/javascript";
    loginJS.src = "/js/login.js";
    document.body.append(loginJS);
    break;
  case "/auth/login":
    var loginJS = document.createElement('script');
    loginJS.type = "text/javascript";
    loginJS.src = "/js/login.js";
    document.body.append(loginJS);
    break;
  case "/profile-edit":
    var profileEditJS = document.createElement('script');
    profileEditJS.type = "text/javascript";
    profileEditJS.src = "/js/profile-edit.js";
    document.body.append(profileEditJS);
    break;
  case "/auth/profile-edit":
    var profileEditJS = document.createElement('script');
    profileEditJS.type = "text/javascript";
    profileEditJS.src = "/js/profile-edit.js";
    document.body.append(profileEditJS);
    break;
  case "/auth/update-password":
    var passwordResetUpdateJS = document.createElement('script');
    passwordResetUpdateJS.type = "text/javascript";
    passwordResetUpdateJS.src = "/js/password-reset-update.js";
    document.body.append(passwordResetUpdateJS);
    break;
  case "/password-reset":
    var passwordResetJS = document.createElement('script');
    passwordResetJS.type = "text/javascript";
    passwordResetJS.src = "/js/password-reset.js";
    document.body.append(passwordResetJS);
    break;
  case "/auth/password-reset":
    var passwordResetJS = document.createElement('script');
    passwordResetJS.type = "text/javascript";
    passwordResetJS.src = "/js/password-reset.js";
    document.body.append(passwordResetJS);
    break;
  case "/add-user":
    var addUserJS = document.createElement('script');
    addUserJS.type = "text/javascript";
    addUserJS.src = "/js/add-user.js";
    document.body.append(addUserJS);
    break; 
  case "/auth/add-user":
    var addUserJS = document.createElement('script');
    addUserJS.type = "text/javascript";
    addUserJS.src = "/js/add-user.js";
    document.body.append(addUserJS);
    break;
  case "/dashboard":
    var dashboardJS = document.createElement('script');
    dashboardJS.type = "text/javascript";
    dashboardJS.src = "/js/dashboard.js";
    document.body.append(dashboardJS);
    break
  case "/auth/delete-account":
    var dashboardJS = document.createElement('script');
    dashboardJS.type = "text/javascript";
    dashboardJS.src = "/js/auth-dashboard.js";
    document.body.append(dashboardJS);
}

// DROPDOWN MENU
document.addEventListener("click", e => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]")
  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return

  let currentDropdown
  if (isDropdownButton) {
      currentDropdown = e.target.closest("[data-dropdown]")
      currentDropdown.classList.toggle("active")
  }

  document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
      if (dropdown === currentDropdown) return
      dropdown.classList.remove("active")
  })
});

// HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu-responsive");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));
window.addEventListener('scroll', () => {
	hamburger.classList.remove("active");
	navMenu.classList.remove("active");
})

// COOKIES MESSAGE
setCookie = (cName, cValue, expDays) => {
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

getCookie = (cName) => {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded.split("; ");
  let value;
  cArr.forEach(val => {
    if(val.indexOf(name) === 0) value = val.substring(name.length);
  })

  return value;
}

document.querySelector("#cookies-btn").addEventListener("click", () => {
  document.querySelector("#cookies").style.display = "none";
  setCookie("cookie", true, 90);
})

cookieMessage = () => {
  if(!getCookie("cookie"))
    document.querySelector("#cookies").style.display = "block";
}

window.addEventListener("load", cookieMessage);