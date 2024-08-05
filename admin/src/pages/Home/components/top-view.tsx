import { CatalogType } from "@/constants";
import { apiTopView } from "@/services/catalog";
import { EyeOutlined } from "@ant-design/icons";
import { ProCard, ProList } from "@ant-design/pro-components"
import { FormattedMessage, Link } from "@umijs/max";
import moment from "moment";
import { useEffect, useState } from "react"

const TopView: React.FC = () => {

    const [dataSource, setDataSource] = useState<API.Catalog[]>([]);
    const [activeKey, setActiveKey] = useState<string>(CatalogType.Article.toString());

    useEffect(() => {
        apiTopView(activeKey).then(response => {
            setDataSource(response);
        })
    }, [activeKey]);

    const Children = () => <ProList
        ghost
        dataSource={dataSource}
        metas={{
            title: {
                dataIndex: 'name',
                render: (dom, entity) => <Link to={`/catalog/${entity.id}`}>{dom}</Link>
            },
            description: {
                render: (dom, entity) => (
                    <>{moment(entity.modifiedDate).format('DD/MM/YYYY hh:mm')} | <EyeOutlined /> {entity.viewCount.toLocaleString()}</>
                )
            }
        }}
    />

    return (
        <>
            <ProCard title="Top view" tabs={{
                tabPosition: 'top',
                activeKey: activeKey,
                onChange: (actKey) => setActiveKey(actKey),
                items: [
                    {
                        label: <FormattedMessage id='menu.catalog.article' />,
                        key: CatalogType.Article.toString(),
                        children: <Children />,
                    },
                    {
                        label: <FormattedMessage id='menu.ecommerce.product' />,
                        key: CatalogType.Product.toString(),
                        children: <Children />,
                    },
                    {
                        label: 'Tag',
                        key: CatalogType.Tag.toString(),
                        children: <Children />,
                    }
                ],
            }}>

            </ProCard>
        </>
    )
}

export default TopView