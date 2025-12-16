import FormEditor from "@/components/editorjs/editor-form";
import { apiPlaceDetails, apiPlaceUpdate } from "@/services/locations/place";
import { PageContainer, ProCard, ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { useParams, useRequest } from "@umijs/max";
import { Col, message, Row } from "antd";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();

    const { data, loading } = useRequest(() => apiPlaceDetails(id));

    const onFinish = async (values: any) => {
        await apiPlaceUpdate({
            id,
            ...values,
            content: JSON.stringify(values.content)
        });
        message.success('Succeeded!');
    }

    return (
        <PageContainer>
            <ProCard>
                <ProForm onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col md={18} xs={24}>
                            {
                                !loading && (
                                    <FormEditor name={"content"} label="Content"
                                        rules={[
                                            {
                                                required: true
                                            }
                                        ]}
                                        initialValue={JSON.parse(data?.content || '{}')}
                                    />
                                )
                            }
                        </Col>
                        <Col md={6} xs={24}>
                            <ProFormSelect name="streetId" label="Street" initialValue={data?.streetId} />
                            <ProFormText name={"address"} label="Address" initialValue={data?.address} />
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
        </PageContainer>
    )
}

export default Index;