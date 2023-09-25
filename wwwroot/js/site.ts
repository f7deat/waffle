class Site {

    public static updateCartItem() {
        const productInCart = JSON.parse(localStorage.getItem('cart_items')) as ProductType.CartItem[];
        if (productInCart && productInCart.length > 0) {
            const cartItemNumber = document.querySelector('#js-cartItemNumber');
            cartItemNumber.textContent = productInCart.length.toString();
        }
    }

    public static toast = (message: string) => {
        const toastEl = document.querySelector('.toast');
        const bsToast = new bootstrap.Toast(toastEl);
        const body = toastEl.querySelector('.toast-body');
        body.textContent = message;
        bsToast.show();
    }

    public static init() {
        this.updateCartItem();
    }
}