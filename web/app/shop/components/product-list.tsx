import { ProductItemType } from "@/typings/shop/product";
import ProductItem from "./product-item";

const ProductList: React.FC<{ products: ProductItemType[] }> = ({ products }) => {

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 2xl:grid-cols-6">
            {products.map((product) => (
                <ProductItem key={product.id} {...product} />
            ))}
        </div>
    );
}

export default ProductList;