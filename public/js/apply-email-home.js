// SHOWCASE CAROUSEL
const images = ["/img/teamwork_img1.jpg", "/img/teamwork_img2.jpg", "/img/teamwork_img3.jpg"];
const carousel = document.querySelector("#showcase-carousel");
const interval = setInterval(function () {
    startCarousel();
}, 7000);
var i = 1;

startCarousel = () => {
  carousel.style.backgroundImage = `url(${images[i++]})`;
  carousel.classList.remove("fade");
  void carousel.offsetWidth;
  carousel.classList.add("fade");
  if (i > images.length - 1) i = 0;
}

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