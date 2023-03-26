import Collapse from "./collapse/index.js";

new Collapse();

function navInit() {
    const navbarTogglers = document.querySelectorAll('.navbar-toggler');
    if (!navbarTogglers || navbarTogglers.length < 1) {
        console.warn('Navbar toggler not found!');
        return;
    }
    navbarTogglers.forEach(navbarToggler => navbarToggler.addEventListener('click', (e) => {
        const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement;
        if (!navbarCollapse) {
            console.error('Navbar collapse not found!');
            return;
        }
        navbarCollapse.classList.toggle('show');
    }));
}

navInit();

//if ('serviceWorker' in navigator) {
//    window.addEventListener('load', () => {
//        navigator.serviceWorker
//            .register("/serviceWorker.js", {
//                scope: '.'
//            })
//            .then(res => console.log("🍀 Service Worker registered!"))
//            .catch(err => console.log("🔥 Service Worker not registered", err))
//    })
//}