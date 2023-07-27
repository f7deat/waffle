import Swiper from "swiper";

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
    new Swiper(".js-swiper-parallax", {
        slidesPerView: 6,
        spaceBetween: 30,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: true,
        loop: true
    });
}