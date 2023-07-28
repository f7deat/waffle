import Swiper from 'swiper';
import 'swiper/css';

export function swiperDefault() {
    new Swiper(".js-swiper-default", {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        }
    });
}

export function swiperParallax() {
    const selector = document.querySelector('.js-swiper-parallax') as HTMLElement;
    if (!selector) {
        return;
    }
    new Swiper(".js-swiper-parallax", {
        slidesPerView: 2,
        spaceBetween: 30,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: true,
        loop: true,
        breakpoints: {
            768: {
                slidesPerView: 6,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 8,
                spaceBetween: 40
            }
        }
    });
}