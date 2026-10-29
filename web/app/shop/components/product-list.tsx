import { ProductItemType } from "@/typings/shop/product";
import ProductItem from "./product-item";

const ProductList: React.FC<{ products: ProductItemType[] }> = ({ products }) => {

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {products.map((product) => (
                <ProductItem key={product.id} {...product} />
            ))}
        </div>
    );
}

export default ProductList;