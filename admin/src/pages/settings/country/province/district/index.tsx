import { apiDistrictList } from "@/services/locations/district";
import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProTable } from "@ant-design/pro-components";
import { Link, useParams } from "@umijs/max";
import { Button } from "antd";
import { useRef, useState } from "react";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [openForm, setOpenForm] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();

    return (
        <PageContainer>
            <ProTable
                actionRef={actionRef}
                request={apiDistrictList}
                rowKey={"id"}
                params={{ provinceId: id }}
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
                            <Link key={"view"} to={`/settings/country/province/district/${record.id}`}>
                                <Button type="primary" icon={<EyeOutlined />} size="small" />
                            </Link>
                        ]
                    }
                ]}
                search={{
                    layout: 'vertical'
                }}
            />
            <ModalForm open={openForm} onOpenChange={setOpenForm}>
                {/* Form fields for adding a new district can be added here */}
            </ModalForm>
        </PageContainer>
    )
}

export default Index;