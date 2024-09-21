import { FormTag } from '@/components/form';
import { AbstractBlock } from '@/typings/work';
import {
  ProFormDigit,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';

const ArticlePicker: React.FC<AbstractBlock> = ({ data }) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (data) {
      formRef.current?.setFields([
        {
          name: 'title',
          value: data.title,
        },
        {
          name: 'pageSize',
          value: data.pageSize,
        },
        {
          name: 'tagId',
          value: data.tagId,
        },
      ]);
    }
  }, [data]);

  return (
    <>
      <ProFormText label="Title" name="title" />
      <ProFormDigit label="Page size" name="pageSize" />
      <FormTag name="tagId" label="Tag" />
    </>
  );
};

export default ArticlePicker;
