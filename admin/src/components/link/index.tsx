import {
  ProForm,
  ProFormInstance,
  ProFormItemProps,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Radio, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import FormCatalogList from '../form/catalog-list';

const ProFormLink: React.FC<ProFormItemProps> = (props) => {
  const formRef = ProForm.useFormInstance();
  const formChildRef = useRef<ProFormInstance>();

  const [value, setValue] = useState('internal');

  useEffect(() => {
    const link: CPN.Link = formRef?.getFieldValue('link');
    if (link) {
      formChildRef.current?.setFields([
        {
          name: 'name',
          value: link.name
        },
        {
          name: 'href',
          value: link.href
        },
        {
          name: 'target',
          value: link.target
        }
      ])
    }
  }, []);

  return (
    <>
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
            <FormCatalogList label="Chọn" name='url' />
          )
        }
        {
          value === 'external' && (
            <>
              <ProFormText name="name" label="Name" />
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
    </>
  );
};

export default ProFormLink;
