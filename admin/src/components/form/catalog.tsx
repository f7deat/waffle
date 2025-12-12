import { CatalogType } from "@/constants";
import { apiCatalogDetail } from "@/services/catalog";
import { ModalForm, ModalFormProps, ProFormDigit, ProFormInstance, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
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

    return (
        <ModalForm {...props} title="Catalog Form">
            <ProFormText name="id" hidden />
            <ProFormText name="name" label="Name" />
            <ProFormTextArea name="description" label="Description" />
            <ProFormText name="parentId" hidden />
            <ProFormDigit name="type" hidden />
            <ProFormSelect name="active" label="Active" initialValue={true} options={[
                {
                    label: 'Active',
                    value: true
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