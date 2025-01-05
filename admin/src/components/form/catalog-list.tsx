import { CatalogType } from '@/constants';
import { queryCatalogSelect } from '@/services/catalog';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';

type Props = ProFormSelectProps & {
    type?: CatalogType;
}

const FormCatalogList: React.FC<Props> = (props) => {

    return (
        <ProFormSelect
            {...props}
            showSearch
            request={(params) => {
                let type = null;
                if (props.type === CatalogType.Room) {
                    type = CatalogType.City;
                }
                if (props.type === CatalogType.City) {
                    type = CatalogType.Country;
                }
                return queryCatalogSelect({
                    ...params,
                    type
                });
            }}
        />
    );
};

export default FormCatalogList;
