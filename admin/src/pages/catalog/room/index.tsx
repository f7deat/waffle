import { ProForm, ProFormDigit, ProFormInstance, ProFormSwitch, ProFormText } from "@ant-design/pro-components"
import { useParams } from "@umijs/max"
import { Col, Row, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { apiGetRoom, apiSaveRoom } from "@/services/rooms/room";

const RoomDetail: React.FC = () => {

    const { id } = useParams();
    const formRef = useRef<ProFormInstance>();

    useEffect(() => {
        apiGetRoom(id).then(response => {
            if (response) {
                formRef.current?.setFields([
                    {
                        name: 'affiliateLink',
                        value: response.affiliateLink
                    }
                ]);
            }
        })
    }, []);

    const onFinish = async (values: any) => {
        values.catalogId = id;
        const response = await apiSaveRoom(values);
        if (response.succeeded) {
            message.success('Saved');
        }
    }

    return (
        <>
            <ProForm onFinish={onFinish} formRef={formRef}>
                <ProFormText name="affiliateLink" label="Affiliate link" />
            </ProForm>
        </>
    )
}

export default RoomDetail