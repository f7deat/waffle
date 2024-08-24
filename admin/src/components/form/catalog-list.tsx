import { queryCatalogSelect } from '@/services/catalog';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';

const FormCatalogList: React.FC<ProFormSelectProps> = (props) => {
    return (
        <ProFormSelect
            {...props}
            showSearch
            request={queryCatalogSelect}
        />
    );
};

export default FormCatalogList;
