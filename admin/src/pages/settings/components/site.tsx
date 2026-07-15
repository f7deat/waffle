import ImageLibraryPicker from '@/components/image-library/picker';
import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Col, Row } from 'antd';

const SiteSettings: React.FC = () => {
  const form = ProForm.useFormInstance();

  return (
    <>
      <Row gutter={16}>
        <Col span={18}>
          <ProFormText name="name" label="Site Name" />
        </Col>
        <Col span={6}>
          <ProFormSelect name="theme" label="Site Theme" initialValue={"DEFAULT"} allowClear={false} options={[
            { label: 'Default', value: 'DEFAULT' },
            { label: 'Shinec', value: 'SHINEC' },
          ]} />
        </Col>
      </Row>
      <ProFormText
        name="logo"
        label="Site Logo"
        fieldProps={{
          addonAfter: (
            <ImageLibraryPicker
              onChange={(url) => form?.setFieldValue('logo', url)}
            />
          ),
        }}
      />
      <ProFormText name="title" label="Site Title" />
      <ProFormTextArea name="description" label="Site Description" />
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText name="phoneNumber" label="Phone Number" />
        </Col>
        <Col span={12}>
          <ProFormText name="email" label="Email" />
        </Col>
      </Row>
      <ProFormText name="address" label="Address" />
    </>
  );
};

export default SiteSettings;