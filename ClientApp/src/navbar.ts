export function navInit() {
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