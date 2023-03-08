class Collapse {

    public static init() {
        const elements = document.querySelectorAll('[data-toggle="collapse"]');
        if (elements) {
            elements.forEach(element => {
                element.addEventListener('click', (e) => {
                    const selector = e.currentTarget as HTMLElement;
                    document.querySelector(selector.dataset.target).classList.toggle('hidden');
                });
            });
        }
    }
}

export default Collapse;