import { apiCountryCreate } from "@/services/settings/country";
import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, PageContainer, ProFormText } from "@ant-design/pro-components"
import { Button } from "antd";
import { useState } from "react";

const Index: React.FC = () => {

    const [openForm, setOpenForm] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        await apiCountryCreate(values);
        return true;
    }


    return (
        <PageContainer extra={<Button type="primary" onClick={() => setOpenForm(true)} icon={<PlusOutlined />}>Add Country</Button>}>
            <ModalForm open={openForm} onOpenChange={setOpenForm} onFinish={onFinish}>
                <ProFormText name="name" label="Country Name" rules={[
                    {
                        required: true
                    }
                ]} />
            </ModalForm>
        </PageContainer>
    )
}

export default Index;