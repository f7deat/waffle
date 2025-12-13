import { CatalogType } from "@/constants";
import { apiCatalogAdd, apiCatalogDetail } from "@/services/catalog";
import { ModalForm, ModalFormProps, ProFormDigit, ProFormInstance, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useRef } from "react";

type Props = ModalFormProps & {
    reload?: () => void;
    catalogId?: string;
    type: CatalogType;
}

const CatalogForm: React.FC<Props> = ({ reload, catalogId, ...props }) => {

    const formRef = useRef<ProFormInstance>(null);

    useEffect(() => {
        if (catalogId) {
            apiCatalogDetail(catalogId).then((response) => {
                formRef.current?.setFieldsValue(response.data);
            });
        }
    }, [catalogId]);

    const onFinish = async (values: any) => {
        if (values.id) {

        } else {
            await apiCatalogAdd({
                ...values,
                type: props.type
            });
        }
        message.success('Succeeded!');
        formRef.current?.resetFields();
        reload?.();
        return true;
    }

    return (
        <ModalForm {...props} title="Catalog Form" onFinish={onFinish} formRef={formRef}>
            <ProFormText name="id" hidden />
            <ProFormText name="name" label="Name" />
            <ProFormTextArea name="description" label="Description" />
            <ProFormText name="parentId" hidden />
            <ProFormDigit name="type" hidden />
            <ProFormSelect name="active" label="Active" initialValue={true} options={[
                {
                    label: 'Active',
                    value: true as any
                },
                {
                    label: 'Draft',
                    value: false
                }
            ]} allowClear={false} />
        </ModalForm>
    );
};
export default CatalogForm;