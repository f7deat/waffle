import CatalogList from "@/components/catalog/list";
import { CatalogType } from "@/constants";
import { listCatalog } from "@/services/catalog";
import { CalendarOutlined } from "@ant-design/icons";
import { PageContainer, ProList } from "@ant-design/pro-components"
import { Link } from "@umijs/max";
import dayjs from "dayjs";

const ProductPage: React.FC = () => {
    return (
        <PageContainer>
            <ProList
                request={listCatalog}
                params={{
                    type: CatalogType.Product
                }}
                ghost
                rowKey={"id"}
                grid={{
                    xxl: 4,
                    gutter: 16
                }}
                renderItem={(item: API.Catalog) => {
                    return (
                        <div key={item.id}>
                            <div className="mb-2 mx-2 bg-white">
                                <img src={item.thumbnail} alt={item.name} className="object-cover w-full h-52" />
                                <div className="p-2">
                                    <Link to={`/shop/product/center/${item.id}`} className="font-medium py-1 block text-blue-500">
                                        {item.name}
                                    </Link>
                                    <div className="text-gray-500 line-clamp-2">{item.description}</div>
                                    <div className="text-xs pt-2 border-t border-dashed text-gray-400 mt-2">
                                        <CalendarOutlined /> {dayjs(item.createdDate).format('YYYY-MM-DD HH:mm')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }}
                pagination={{
                    pageSize: 12,
                    size: 'small'
                }}
            />
        </PageContainer>
    );
}
export default ProductPage;