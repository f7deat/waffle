class Product {

    public static onQuantityChange(plus: boolean) {
        const productId = (document.querySelector('#js-productId') as HTMLInputElement).value;
        const input = document.querySelector('#js-quantityInput') as HTMLInputElement;
        if (plus) {
            input.value = (Number(input.value) + 1).toString();
        } else {
            if ((Number(input.value) < 2)) {
                return;
            }
            input.value = (Number(input.value) - 1).toString();
        }
    }

    public static init() {
        const btnAddToCart = document.querySelector('#js-addToCart');
        if (btnAddToCart) {
            btnAddToCart.addEventListener('click', this.addToCart);
        }
        document.querySelector('#js-plusQuantity').addEventListener('click', (evt) => {
            Product.onQuantityChange(true);
        });
        document.querySelector('#js-minusQuantity').addEventListener('click', (evt) => {
            Product.onQuantityChange(false);
        });
    }

    private static addToCart() {
        const productElement = document.querySelector('#js-productId') as HTMLInputElement;
        const productId = productElement.value;

        const productInCart = JSON.parse(localStorage.getItem('cart_items') || '[]') as ProductType.CartItem[];

        const quantityEl = document.querySelector('#js-quantityInput') as HTMLInputElement;
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