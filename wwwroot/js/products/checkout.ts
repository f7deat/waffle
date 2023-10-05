class Checkout {

    private static getProducts() {
        const container = document.querySelector('#js-products') as HTMLElement;
        fetch('/api/product/cart-items/checkout', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: localStorage.getItem('cart_items')
        }).then(response => response.text().then(data => {
            container.innerHTML = data;
        }))
    }

    public static validatePhoneNumber(input_str) {
        var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return re.test(input_str);
    }

    public static isValid(body) {
        if (!body.name) {
            Site.toast('Vui lòng nhập họ và tên!');
            return false;
        }
        if (!body.phoneNumber) {
            Site.toast('Vui lòng nhập số điện thoại!');
            return false;
        }
        if (!body.address) {
            Site.toast('Vui lòng nhập địa chỉ!');
            return false;
        }
        if (!this.validatePhoneNumber(body.phoneNumber)) {
            Site.toast('Số điện thoại không hợp lệ!');
            return false;
        }
        return true;
    }

    private static onFinish() {
        const body = {
            name: (document.querySelector('#js-name') as HTMLInputElement).value,
            phoneNumber: (document.querySelector('#js-phoneNumber') as HTMLInputElement).value,
            address: (document.querySelector('#js-address') as HTMLInputElement).value,
            note: (document.querySelector('#js-note') as HTMLInputElement).value,
            orderDetails: JSON.parse(localStorage.getItem('cart_items') || '[]')
        }
        if (!Checkout.isValid(body)) {
            return;
        }
        (document.querySelector('#js-btnCheckout') as HTMLButtonElement).disabled = true;
        fetch('/api/order/place-order', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => {
            if (!response.ok) {
                Site.toast('Có lỗi xảy ra!');
                return;
            }
            response.text().then(data => {
                localStorage.removeItem('cart_items');
                window.location.href = data;
            })
        })
    }

    public static init() {
        this.getProducts();
        document.querySelector('#js-btnCheckout').addEventListener('click', this.onFinish);
    }
}