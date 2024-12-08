import { apiMenuAdd, apiMenuGet, apiMenuParent, apiMenuUpdate } from "@/services/menu";
import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ModalFormProps, ProFormDigit, ProFormInstance, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components"
import { Button, Col, message, Row } from "antd";
import { useEffect, useRef } from "react";

type Props = ModalFormProps & {
    reload: any;
}

const MenuForm: React.FC<Props> = (props) => {

    const formRef = useRef<ProFormInstance>();

    useEffect(() => {
        if (props.id) {
            apiMenuGet(props.id).then(response => {
                formRef.current?.setFields([
                    {
                        name: 'id',
                        value: response.id
                    },
                    {
                        name: 'name',
                        value: response.name
                    },
                    {
                        name: 'url',
                        value: response.url
                    },
                    {
                        name: 'sortOrder',
                        value: response.sortOrder
                    },
                    {
                        name: 'sortOrder',
                        value: response.sortOrder
                    },
                    {
                        name: 'active',
                        value: response.active
                    },
                    {
                        name: 'icon',
                        value: response.icon
                    }
                ])
            })
        }
    }, [props.id])

    return (
        <>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => props.onOpenChange?.(true)}>Tạo mới</Button>
            <ModalForm {...props} title="Menu setting"
                formRef={formRef}
                onFinish={async (values) => {
                    if (values.id) {
                        await apiMenuUpdate(values);
                    } else {
                        await apiMenuAdd(values);
                    }
                    message.success('Thành công!');
                    props.onOpenChange?.(false);
                    props.reload();
                }}>
                <ProFormText name="id" hidden />
                <ProFormText name="name" label="Name" rules={[
                    {
                        required: true
                    }
                ]} />
                <ProFormText name="url" label="Url" />
                <ProFormText name="icon" label="Icon" />
                <ProFormSelect name="parentId" label="Parent" request={apiMenuParent} />
                <Row gutter={16}>
                    <Col span={12}>
                        <ProFormDigit name="sortOrder" label="Sort order" />
                    </Col>
                    <Col span={12}>
                        <ProFormSwitch name="active" label="Active" />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default MenuForm;