import { queryCatalogSelect } from '@/services/catalog';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';

const FormCatalogList: React.FC<ProFormSelectProps> = (props) => {
    return (
        <ProFormSelect
            {...props}
            showSearch
            request={(params) => queryCatalogSelect({
                ...params
            })}
        />
    );
};

export default FormCatalogList;
