import { listTagSelect } from '@/services/catalog';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';

const FormTag: React.FC<ProFormSelectProps> = (props) => {
  return (
    <ProFormSelect
      showSearch
      request={listTagSelect}
      {...props}
    />
  );
};

export default FormTag;
