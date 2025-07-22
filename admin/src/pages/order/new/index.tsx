import { LeftOutlined } from "@ant-design/icons";
import { PageContainer, ProCard, ProForm, ProFormSelect } from "@ant-design/pro-components";
import { history } from "@umijs/max";
import { Button, Divider } from "antd";

const NewOrderPage: React.FC = () => {

    return (
        <PageContainer extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}>Back</Button>} title="New Order">
            <ProCard>
            <ProForm>
                <Divider>Details</Divider>
                <ProFormSelect label="Product" />
            </ProForm>
            </ProCard>
        </PageContainer>
    )
}

export default NewOrderPage;