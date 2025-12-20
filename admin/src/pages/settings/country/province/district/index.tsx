import { apiDistrictList } from "@/services/locations/district";
import { EyeOutlined, LeftOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProTable } from "@ant-design/pro-components";
import { history, Link, useParams } from "@umijs/max";
import { Button } from "antd";
import { useRef, useState } from "react";
import DistrictForm from "./components/form";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [openForm, setOpenForm] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();

    return (
        <PageContainer extra={<Button onClick={() => history.back()} icon={<LeftOutlined />}>Back</Button>}>
            <ProTable
                headerTitle={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>Add District</Button>}
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
            <DistrictForm open={openForm} onOpenChange={setOpenForm} reload={() => actionRef.current?.reload()} />
        </PageContainer>
    )
}

export default Index;