// APPLY BUTTON - DISPLAYS MODAL
const overlay = document.querySelector("#modal-overlay");
overlay.style.display = "block";

document.querySelector("#show-modal-button").addEventListener("click", () => {
    overlay.style.display = "block";
});

document.querySelector("#close-modal-btn").addEventListener("click", () => {
    overlay.style.display = "none";
});

// reCaptcha
applyFormRequest = (token) => {
  document.querySelector("#apply-form").submit();
}