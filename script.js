// JavaScript for gallery slideshow
const gallerySlideshow = document.getElementById('gallery-slideshow');

// Clone the images and append them to the beginning and end of the slideshow
const images = gallerySlideshow.querySelectorAll('img');
const firstImageClone = images[0].cloneNode(true);
const lastImageClone = images[images.length - 1].cloneNode(true);
gallerySlideshow.insertBefore(lastImageClone, images[0]);
gallerySlideshow.appendChild(firstImageClone);

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let slideIndex = 1; // Index of the currently visible slide

gallerySlideshow.addEventListener('mousedown', startDrag);
gallerySlideshow.addEventListener('touchstart', startDrag);

gallerySlideshow.addEventListener('mousemove', drag);
gallerySlideshow.addEventListener('touchmove', drag);

gallerySlideshow.addEventListener('mouseup', endDrag);
gallerySlideshow.addEventListener('touchend', endDrag);

gallerySlideshow.addEventListener('transitionend', checkEndTransition);

function startDrag(event) {
  event.preventDefault();
  isDragging = true;
  startPos = getPositionX(event);
  currentTranslate = getTranslateX();
}

function drag(event) {
  if (!isDragging) return;
  const currentPosition = getPositionX(event);
  const difference = currentPosition - startPos;
  gallerySlideshow.style.transition = 'none';
  gallerySlideshow.style.transform = `translateX(${currentTranslate + difference}px)`;
}

function endDrag(event) {
  isDragging = false;
  const currentPosition = getPositionX(event);
  const difference = currentPosition - startPos;
  const slideWidth = gallerySlideshow.getBoundingClientRect().width;
  if (Math.abs(difference) > slideWidth / 3) {
    if (difference > 0) {
      slideIndex--;
    } else {
      slideIndex++;
    }
  }
  goToSlide(slideIndex);
}

function goToSlide(index) {
  const slideWidth = gallerySlideshow.getBoundingClientRect().width;
  currentTranslate = -index * slideWidth;
  gallerySlideshow.style.transition = 'transform 0.3s ease';
  gallerySlideshow.style.transform = `translateX(${currentTranslate}px)`;
}

function checkEndTransition() {
  if (slideIndex <= 0) {
    slideIndex = images.length;
    goToSlide(slideIndex);
  } else if (slideIndex > images.length) {
    slideIndex = 1;
    goToSlide(slideIndex);
  }
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
}

function getTranslateX() {
  const style = window.getComputedStyle(gallerySlideshow);
  const transform = style.transform || style.webkitTransform;
  const matrix = new DOMMatrixReadOnly(transform);
  return matrix.m41;
}
