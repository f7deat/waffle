import ProFormImage from '@/components/image/form';
import { AbstractBlock } from '@/typings/work';
import {
  ProForm,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useEffect } from 'react';

const Jumbotron: React.FC<AbstractBlock> = ({ data }) => {
  const formRef = ProForm.useFormInstance<ProFormInstance>();

  useEffect(() => {
    if (data) {
      formRef.setFields([
        {
          name: 'backgroundImage',
          value: data.backgroundImage,
        },
        {
          name: 'title',
          value: data.title,
        },
        {
          name: 'subTitle',
          value: data.subTitle,
        },
        {
          name: 'description',
          value: data.description,
        },
      ]);
    }
  }, [data]);

  return (
    <Row gutter={16}>
      <Col md={8}>
        <ProFormImage name="backgroundImage" label="Background image" />
      </Col>
      <Col md={16}>
        <ProFormText name="title" label="Title" />
        <ProFormText name="subTitle" label="Sub Title" />
        <ProFormTextArea name="description" label="Description" />
      </Col>
    </Row>
  );
};

export default Jumbotron;
