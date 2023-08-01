import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function swiperDefault() {
    new Swiper(".js-swiper-default", {
        slidesPerView: 1,
        loop: true,
        autoplay: {
            delay: 2500
        },
        modules: [Autoplay, Pagination, Navigation],
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        }
    });
}

export function swiperSponsor() {
    const selector = document.querySelector('.js-swiper-sponsor') as HTMLElement;
    if (!selector) {
        return;
    }
    new Swiper(".js-swiper-sponsor", {
        spaceBetween: 30,
        loop: true,
        autoplay: true,
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 6
            },
            1024: {
                slidesPerView: 8
            }
        },
        modules: [Autoplay, Navigation]
    });
}