import FormCatalogType from '@/components/form/catalog-type';
import { AbstractBlock } from '@/typings/work';
import {
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useEffect } from 'react';

const Feed: React.FC<AbstractBlock> = ({ data }) => {
  const formRef = ProForm.useFormInstance<ProFormInstance>();

  useEffect(() => {
    formRef?.setFields([
      {
        name: 'name',
        value: data.name,
      },
      {
        name: 'type',
        value: data.type ?? 0,
      },
      {
        name: 'pageSize',
        value: data.pageSize,
      },
    ]);
  }, [data]);

  return (
    <>
      <ProFormText name="name" label="Name" rules={[
        {
          required: true
        }
      ]} />
      <FormCatalogType name="type" label="Type" />
      <ProFormDigit name="pageSize" label="Page size" />
    </>
  );
};

export default Feed;
