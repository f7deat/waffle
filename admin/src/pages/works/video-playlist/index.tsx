import { saveArguments } from '@/services/work-content';
import {
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { message } from 'antd';
import { useRef, useEffect } from 'react';

type Props = {
  data: any;
}

const VideoPlaylist: React.FC<Props> = ({ data }) => {
  const { id } = useParams();
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
          name: 'className',
          value: data.className
        }
      ]);
    }
  }, [data]);

  const onFinish = async (values: any) => {
    const response = await saveArguments(id, values);
    if (response.succeeded) {
      message.success('Saved');
    }
  };

  return (
    <ProForm formRef={formRef} onFinish={onFinish}>
      <ProFormText name="title" label="Title" />
      <ProFormText name="className" label="Class name" />
      <ProFormDigit name="pageSize" label="Page size" />
    </ProForm>
  );
};

export default VideoPlaylist;
