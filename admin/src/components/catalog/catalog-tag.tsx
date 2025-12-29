import { apiCatalogTags, apiSaveCatalogTags } from "@/services/catalog";
import { apiTagOptions } from "@/services/tag";
import { ProForm, ProFormSelect } from "@ant-design/pro-components";
import { useParams, useRequest } from "@umijs/max";
import { useEffect } from "react";

const CatalogTag: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const formRef = ProForm.useFormInstance();
    const { data } = useRequest(() => apiCatalogTags(id));

    useEffect(() => {
        if (data) {
            formRef.setFieldsValue({
                tags: data?.map(x => x.id)
            });
        }
    }, [data]);

    return (
        <div>
            <ProFormSelect name={"tags"} label="Tags" mode="multiple" request={apiTagOptions}
                onChange={async (value: string[]) => {
                    if (!id) return;
                    await apiSaveCatalogTags({
                        catalogId: id,
                        tagIds: value
                    });
                }}
            />
        </div>
    )
}

export default CatalogTag;