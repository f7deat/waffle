import { apiGetUrlOption } from '@/services/catalog';
import {
  ProForm,
  ProFormItemProps,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Radio, Row } from 'antd';
import { useState } from 'react';

const ProFormLink: React.FC<ProFormItemProps> = (props) => {
  const formRef = ProForm.useFormInstance();

  const [value, setValue] = useState('internal');

  return (
    <ProForm.Item {...props}>
      <Radio.Group options={[
        {
          label: 'Liên kết nội bộ',
          value: 'internal'
        },
        {
          label: 'Liên kết ngoài',
          value: 'external'
        }
      ]} value={value} onChange={(e) => setValue(e.target.value)} className='mb-2' />
      {
        value === 'internal' && (
          <>
            <ProFormText name="name" hidden />
            <Row gutter={16}>
              <Col md={18}>
                <ProFormSelect
                  allowClear={false}
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  showSearch
                  request={apiGetUrlOption} label="Chọn liên kết" name='href' onChange={(_, option) => {
                    formRef.setFieldValue('name', option.title);
                  }} />
              </Col>
              <Col md={6}>
                <ProFormSelect
                  name="target"
                  label="Target"
                  allowClear
                  options={[
                    {
                      value: '_blank',
                      label: 'Open in new tab',
                    },
                  ]}
                />
              </Col>
            </Row>
          </>
        )
      }
      {
        value === 'external' && (
          <>
            <ProFormText name="name" label="Name" rules={[
              {
                required: true
              }
            ]} />
            <Row gutter={16}>
              <Col md={18}>
                <ProFormText
                  name="href"
                  placeholder="https://"
                  label="URL"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                />
              </Col>
              <Col md={6}>
                <ProFormSelect
                  name="target"
                  label="Target"
                  allowClear
                  options={[
                    {
                      value: '_blank',
                      label: 'Open in new tab',
                    },
                  ]}
                />
              </Col>
            </Row>
          </>
        )
      }
    </ProForm.Item>
  );
};

export default ProFormLink;
