import FormEditor from "@/components/editorjs/editor-form";
import { apiDistrictOptions } from "@/services/locations/district";
import { apiPlaceDetails, apiPlaceUpdate } from "@/services/locations/place";
import { apiProvinceOptions } from "@/services/locations/province";
import { apiStreetOptions } from "@/services/locations/street";
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { useParams, useRequest } from "@umijs/max";
import { Col, message, Row } from "antd";
import { useState } from "react";

const PlaceContent: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { data, loading } = useRequest(() => apiPlaceDetails(id));
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>(data?.provinceId);
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | undefined>(data?.districtId);

    const onFinish = async (values: any) => {
        await apiPlaceUpdate({
            id,
            ...values,
            content: JSON.stringify(values.content)
        });
        message.success('Succeeded!');
    }

    return (
        <div>
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
                                    initialValue={data?.content}
                                />
                            )
                        }
                    </Col>
                    <Col md={6} xs={24}>
                        <ProFormSelect name={"provinceId"} label="Province" initialValue={data?.provinceId} 
                            showSearch
                            request={apiProvinceOptions} 
                            onChange={(value: string) => setSelectedProvinceId(value)}
                        />
                        <ProFormSelect name="districtId" label="District" initialValue={data?.districtId}
                            showSearch
                            dependencies={['provinceId']}
                            request={apiDistrictOptions}
                            params={{
                                provinceId: selectedProvinceId
                            }}
                            onChange={(value: string) => setSelectedDistrictId(value)}
                        />
                        <ProFormSelect name="streetId" label="Street" initialValue={data?.streetId}
                            showSearch
                            dependencies={['districtId']}
                            request={apiStreetOptions}
                            params={{
                                districtId: selectedDistrictId
                            }}
                        />
                        <ProFormText name={"address"} label="Address" initialValue={data?.address} />
                    </Col>
                </Row>
            </ProForm>
        </div>
    )
}

export default PlaceContent;