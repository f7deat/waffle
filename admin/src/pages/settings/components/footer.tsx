import { ProCard, ProForm, ProFormList, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Row, Col } from 'antd';
import { useEffect } from 'react';
import { SettingProps } from './typing';

const FooterSettings: React.FC<SettingProps> = ({ value }) => {

  const form = ProForm.useFormInstance();

  useEffect(() => {
    form.setFieldsValue(value);
  }, [value]);

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <ProFormText name="companyName" label="Company Name" />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText name="email" label="Email" />
        </Col>
        <Col span={12}>
          <ProFormText name="phoneNumber" label="Phone Number" />
        </Col>
      </Row>
      <ProFormTextArea name="address" label="Address" />
      <ProCard title="Social" bordered className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText name={['social', 'facebookUrl']} label="Facebook URL" />
          </Col>
          <Col span={12}>
            <ProFormText name={['social', 'youtubeUrl']} label="Youtube URL" />
          </Col>
          <Col span={12}>
            <ProFormText name={['social', 'xUrl']} label="X (Twitter) URL" />
          </Col>
          <Col span={12}>
            <ProFormText name={['social', 'instagramUrl']} label="Instagram URL" />
          </Col>
        </Row>
      </ProCard>
      <ProFormList
        name="links"
        label="Footer Links"
        creatorButtonProps={{
          creatorButtonText: 'Add Link',
        }}
        copyIconProps={false}
        itemRender={({ listDom }, { index }) => (
          <ProCard key={index} type="inner" className="mb-3" title={`Link #${index + 1}`}>
            {listDom}
          </ProCard>
        )}
      >
        <Row gutter={12}>
          <Col md={8} xs={24}>
            <ProFormText name="name" label="Name" />
          </Col>
          <Col md={10} xs={24}>
            <ProFormText name="href" label="Href" />
          </Col>
          <Col md={6} xs={24}>
            <ProFormText name="target" label="Target" placeholder="_self" />
          </Col>
        </Row>
      </ProFormList>
    </>
  );
};

export default FooterSettings;
