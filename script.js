const slides = Array.from(document.querySelectorAll(".slide"));
const currentSlide = document.querySelector("#currentSlide");
const totalSlides = document.querySelector("#totalSlides");
const progressBar = document.querySelector("#progressBar");
const buttons = document.querySelectorAll("[data-action]");
const revealButtons = document.querySelectorAll(".reveal-button");

let activeIndex = 0;

function renderSlide(index) {
  activeIndex = Math.max(0, Math.min(index, slides.length - 1));

  revealButtons.forEach((button) => {
    const content = button.nextElementSibling;
    if (content?.classList.contains("reveal-content")) {
      content.hidden = true;
      button.hidden = false;
      button.setAttribute("aria-expanded", "false");
    }
  });

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeIndex);
    slide.setAttribute("aria-hidden", String(slideIndex !== activeIndex));
  });

  currentSlide.textContent = String(activeIndex + 1);
  totalSlides.textContent = String(slides.length);
  progressBar.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;

  const title = slides[activeIndex].dataset.title;
  document.title = `${activeIndex + 1}. ${title} - From Coordination to Orchestration`;
}

function moveSlide(direction) {
  renderSlide(activeIndex + direction);
}

window.renderSlide = renderSlide;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    moveSlide(button.dataset.action === "next" ? 1 : -1);
  });
});

revealButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    if (!content?.classList.contains("reveal-content")) {
      return;
    }

    content.hidden = false;
    button.hidden = true;
    button.setAttribute("aria-expanded", "true");
  });
});

document.addEventListener("keydown", (event) => {
  const nextKeys = ["ArrowRight", "ArrowDown", "PageDown", " "];
  const previousKeys = ["ArrowLeft", "ArrowUp", "PageUp"];

  if (nextKeys.includes(event.key)) {
    event.preventDefault();
    moveSlide(1);
  }

  if (previousKeys.includes(event.key)) {
    event.preventDefault();
    moveSlide(-1);
  }

  if (event.key === "Home") {
    renderSlide(0);
  }

  if (event.key === "End") {
    renderSlide(slides.length - 1);
  }
});

let touchStartX = 0;

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;

  if (Math.abs(distance) > 48) {
    moveSlide(distance < 0 ? 1 : -1);
  }
});

renderSlide(0);
