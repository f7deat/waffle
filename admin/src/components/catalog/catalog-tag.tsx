import { ProFormSelect } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";

const CatalogTag: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    
    return (
        <div>
            <ProFormSelect name={"tags"} label="Tags" mode="multiple" />
        </div>
    )
}

export default CatalogTag;