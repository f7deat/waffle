import { apiGetCatalogSetting, apiSaveCatalogSetting } from "@/services/catalog";
import { ProForm, ProFormInstance, ProFormSelect } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { message } from "antd";
import { useEffect, useRef } from "react";

const CatalogInfoComponent: React.FC = () => {

    const { id } = useParams();
    const formRef = useRef<ProFormInstance>();

    useEffect(() => {
        if (id) {
            apiGetCatalogSetting(id).then(response => {
                formRef.current?.setFields([
                    {
                        name: 'layout',
                        value: response.layout
                    }
                ])
            })
        }
    }, [id]);

    const onFinish = async (values: any) => {
        await apiSaveCatalogSetting(values, id);
        message.success('Saved!');
    }

    return (
        <ProForm formRef={formRef} onFinish={onFinish}>
            <ProFormSelect label="Layout" name="layout" rules={[
                {
                    required: true
                }
            ]}
                options={[
                    {
                        label: 'Container',
                        value: 'container'
                    },
                    {
                        label: 'Container Fluid',
                        value: 'container-fluid'
                    }
                ]}
            />
        </ProForm>
    )
}
export default CatalogInfoComponent;