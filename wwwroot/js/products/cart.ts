﻿class Cart {

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
        }))
    }

    public static init() {
        this.getProducts();
    }
}
