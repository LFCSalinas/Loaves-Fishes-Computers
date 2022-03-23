// APPLY BUTTON - DISPLAYS MODAL
const overlay = document.querySelector("#modal-overlay");

document.querySelector("#delete-account-btn").addEventListener("click", () => {
    overlay.style.display = "block";
});

document.querySelector("#close-modal-btn").addEventListener("click", () => {
    overlay.style.display = "none";
});