class Collapse {

    constructor() {
        const elements = document.querySelectorAll('[data-toggle="collapse"]');
        if (elements) {
            elements.forEach(element => {
                element.addEventListener('click', (e) => {
                    const selector = e.currentTarget as HTMLElement;
                    if (selector.dataset.target) {
                        document.querySelector(selector.dataset.target).classList.toggle('hidden');
                    } else {
                        console.warn('Collapse: No target was found!')
                    }
                });
            });
        }
    }
}

export default Collapse;