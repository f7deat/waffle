import { apiStreetCreate, apiStreetList } from "@/services/locations/street";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProFormText, ProTable } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { Button } from "antd";
import { useRef, useState } from "react";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const actionRef = useRef<ActionType>();
    const [openForm, setOpenForm] = useState<boolean>(false);

    return (
        <PageContainer extra={<Button onClick={() => history.back()} icon={<LeftOutlined />}>Back</Button>}>
            <ProTable 
            headerTitle={<Button type="primary" onClick={() => setOpenForm(true)} icon={<PlusOutlined />}>Add Street</Button>}
            actionRef={actionRef} request={apiStreetList} rowKey={"id"} params={{ districtId: id }} columns={[
                {
                    title: '#',
                    valueType: 'indexBorder',
                    width: 30,
                    align: 'center'
                },
                {
                    title: 'Name',
                    dataIndex: 'name'
                }
            ]} search={{
                layout: 'vertical'
            }} />
            <ModalForm open={openForm} onOpenChange={setOpenForm} title="Add Street" onFinish={async (values) => {
                await apiStreetCreate({ ...values, districtId: id });
                setOpenForm(false);
                actionRef.current?.reload();
                return true;
            }}>
                <ProFormText name="name" label="Street Name" placeholder="Enter street name" rules={[{ required: true, message: 'Please enter the street name' }]} />
            </ModalForm>
        </PageContainer>
    )
}

export default Index;