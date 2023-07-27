import Collapse from "./collapse";
import { navInit } from "./navbar";
import 'swiper/css';
import { swiperDefault, swiperParallax } from "./swipers/swiper-default";

navInit();
new Collapse();
swiperDefault();
swiperParallax();