import { apiProvinceList } from "@/services/locations/province";
import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Link, useParams, useRequest } from "@umijs/max";
import { Button } from "antd";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    return (
        <PageContainer>
            <ProTable
                request={apiProvinceList}
                rowKey={"id"}
                params={{ countryId: id }}
                columns={[
                    {
                        title: '#',
                        valueType: 'indexBorder',
                        width: 30,
                        align: 'center'
                    },
                    {
                        title: 'Name',
                        dataIndex: 'name'
                    },
                    {
                        title: <SettingOutlined />,
                        valueType: 'option',
                        width: 50,
                        align: 'center',
                        render: (dom, record) => [
                            <Link key={"view"} to={`/settings/country/province/${record.id}`}>
                                <Button type="primary" icon={<EyeOutlined />} size="small" />
                            </Link>
                        ]
                    }
                ]}
                search={{
                    layout: 'vertical'
                }}
            />
        </PageContainer>
    )
}

export default Index;