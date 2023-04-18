export function navInit() {
    const navbarTogglers = document.querySelectorAll('.navbar-toggler');
    if (!navbarTogglers || navbarTogglers.length < 1) {
        console.warn('Navbar toggler not found!');
        return;
    }
    navbarTogglers.forEach(navbarToggler => navbarToggler.addEventListener('click', (e) => {
        const navbarMenu = document.querySelector('.navbar-menu') as HTMLElement;
        if (!navbarMenu) {
            console.error('Navbar menu not found!');
            return;
        }
        if (navbarMenu.classList.contains('show')) {
            const fade = document.querySelector('.fade');
            fade.remove();
        } else {
            const fade = document.createElement('div');
            fade.className = 'fade';
            document.body.appendChild(fade);
        }
        navbarMenu.classList.toggle('show');
    }));
}