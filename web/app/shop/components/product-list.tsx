"use client";

import { ProductItemType } from "@/typings/shop/product";
import ProductItem from "./product-item";
import { useAppContext } from "@/contexts/app-context";
import { THEME_NAME } from "@/config/theme";

const ProductList: React.FC<{ products: ProductItemType[] }> = ({ products }) => {

    const { settings } = useAppContext();

    if (settings?.theme === THEME_NAME.SHINEC) {
        return (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                    <ProductItem key={product.id} {...product} />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 2xl:grid-cols-6">
            {products.map((product) => (
                <ProductItem key={product.id} {...product} />
            ))}
        </div>
    );
}

export default ProductList;