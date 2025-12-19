import FormEditor from "@/components/editorjs/editor-form";
import { apiDistrictOptions } from "@/services/locations/district";
import { apiPlaceDetails, apiPlaceUpdate } from "@/services/locations/place";
import { apiProvinceOptions } from "@/services/locations/province";
import { apiStreetOptions } from "@/services/locations/street";
import { PageContainer, ProCard, ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { useParams, useRequest } from "@umijs/max";
import { Col, message, Row } from "antd";
import { useState } from "react";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();

    const { data, loading } = useRequest(() => apiPlaceDetails(id));
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>(data?.provinceId);

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
                            <ProFormSelect name={"provinceId"} label="Province" initialValue={data?.provinceId} request={apiProvinceOptions} showSearch />
                            <ProFormSelect name="districtId" label="District" initialValue={data?.districtId}
                                showSearch
                                dependencies={['provinceId']}
                                request={apiDistrictOptions}
                                params={{
                                    provinceId: selectedProvinceId
                                }}
                            />
                            <ProFormSelect name="streetId" label="Street" initialValue={data?.streetId}
                                showSearch
                                dependencies={['districtId']}
                                request={apiStreetOptions}
                            />
                            <ProFormText name={"address"} label="Address" initialValue={data?.address} />
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
        </PageContainer>
    )
}

export default Index;