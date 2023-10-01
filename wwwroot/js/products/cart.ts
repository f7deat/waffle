class Cart {

    public static onRemove(evt: Event) {
        const productEle = evt.currentTarget as HTMLButtonElement;
        const productId = productEle.dataset.productid;
        let products = JSON.parse(localStorage.getItem('cart_items') || '[]') as ProductType.CartItem[];
        products = products.filter(x => x.productId !== productId);
        localStorage.setItem('cart_items', JSON.stringify(products));
        Site.updateCartItem();
        Cart.getProducts();
        Site.toast('Xóa thành công!');
    }

    private static getProducts() {
        const container = document.querySelector('#js-products') as HTMLElement;
        fetch('/api/product/cart-items/view', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: localStorage.getItem('cart_items')
        }).then(response => response.text().then(data => {
            container.innerHTML = data;
            container.querySelectorAll('.js-minusQuantity').forEach(ele => ele.addEventListener('click', (evt) => {
                Cart.onQuantityChange(false, evt)
            }))
            container.querySelectorAll('.js-plusQuantity').forEach(ele => ele.addEventListener('click', (evt) => {
                Cart.onQuantityChange(true, evt)
            }))
            container.querySelectorAll('.js-remove').forEach(ele => ele.addEventListener('click', (evt) => {
                Cart.onRemove(evt)
            }))
        }))
    }

    public static onQuantityChange(plus: boolean, evt: Event) {
        const productEle = evt.currentTarget as HTMLButtonElement;
        const productId = productEle.dataset.productid;
        let products = JSON.parse(localStorage.getItem('cart_items') || '[]') as ProductType.CartItem[];
        const index = products.findIndex(x => x.productId === productId);
        if (index === -1) {
            Site.toast('Không tìm thấy sản phẩm!');
            return;
        }
        if (plus) {
            products[index].quantity++;
        } else {
            products[index].quantity--;
        }
        localStorage.setItem('cart_items', JSON.stringify(products));
        Cart.getProducts();
    }

    public static init() {
        this.getProducts();
    }
}
