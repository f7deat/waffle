declare var axios: any;
declare var bootstrap: any;

class ContactForm {

    selectors = {
        btnSubmit: 'contact-btn-submit',
        inputName: 'contact-input-name',
        inputEmail: 'contact-input-email',
        inputPhoneNumber: 'contact-input-phoneNumber',
        inputNote: 'contact-input-note',
        toast: 'contact-toast'
    }

    constructor() {
        this.init();
    }

    init() {
        document.getElementById(this.selectors.btnSubmit).addEventListener('click', () => {
            axios({
                method: 'POST',
                url: `/api/contact/submit-form`,
                data: {
                    name: (document.getElementById(this.selectors.inputName) as HTMLInputElement).value,
                    email: (document.getElementById(this.selectors.inputEmail) as HTMLInputElement).value,
                    phoneNumber: (document.getElementById(this.selectors.inputPhoneNumber) as HTMLInputElement).value,
                    note: (document.getElementById(this.selectors.inputNote) as HTMLInputElement).value,
                }
            }).then(response => {
                if (response.data.succeeded) {
                    const toast = new bootstrap.Toast(document.getElementById(this.selectors.toast));
                    console.log(toast);
                    toast.show();
                }
            });
        })
    }
}

new ContactForm();