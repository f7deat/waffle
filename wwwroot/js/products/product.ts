class Product {

    public static init() {
        const btnAddToCart = document.querySelector('#js-addToCart');
        if (btnAddToCart) {
            btnAddToCart.addEventListener('click', this.addToCart);
        }
    }

    private static addToCart() {
        const productElement = document.querySelector('#js-productId') as HTMLInputElement;
        const productId = productElement.value;

        const productInCart = JSON.parse(localStorage.getItem('cart_items') || '[]') as ProductType.CartItem[];

        const quantityEl = document.querySelector('#js-quantity-input') as HTMLInputElement;
        const quantity = Number(quantityEl?.value || '1');

        const productIndex = productInCart.findIndex(x => x.productId == productId);
        if (productIndex !== -1) {
            productInCart[productIndex].quantity = productInCart[productIndex].quantity + quantity;
        } else {
            const productNew: ProductType.CartItem = {
                productId,
                quantity: quantity
            }
            productInCart.push(productNew);
        }

        localStorage.setItem('cart_items', JSON.stringify(productInCart));
        Site.updateCartItem();
        Site.toast('Đã thêm vào giỏ hàng!');
    }
}