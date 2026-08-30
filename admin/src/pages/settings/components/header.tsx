import ImageLibraryPicker from '@/components/image-library/picker';
import { ProCard, ProForm, ProFormList, ProFormText } from '@ant-design/pro-components';
import { Row, Col } from 'antd';
import { useEffect } from 'react';
import { SettingProps } from './typing';

const HeaderSettings: React.FC<SettingProps> = ({ value }) => {

  const form = ProForm.useFormInstance();

  useEffect(() => {
    form.setFieldsValue(value);
  }, [value]);

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <ProFormText name="brand" label="Brand" />
        </Col>
      </Row>
      <ProFormText
        name="logo"
        label="Logo"
        fieldProps={{
          addonAfter: (
            <ImageLibraryPicker
              onChange={(url) => form?.setFieldValue('logo', url)}
            />
          ),
        }}
      />
      <ProFormText name="searchPlaceHolder" label="Search Placeholder" />
      <ProFormList
        name="topMenu"
        label="Top Menu"
        creatorButtonProps={{
          creatorButtonText: 'Add Top Menu Item',
        }}
        copyIconProps={false}
        itemRender={({ listDom }, { index }) => (
          <ProCard key={index} type="inner" className="mb-3" title={`Top Menu #${index + 1}`}>
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
      <ProFormList
        name="navItems"
        label="Navigation Items"
        creatorButtonProps={{
          creatorButtonText: 'Add Navigation Item',
        }}
        copyIconProps={false}
        itemRender={({ listDom }, { index }) => (
          <ProCard key={index} type="inner" className="mb-3" title={`Nav Item #${index + 1}`}>
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
            <ProFormText name="icon" label="Icon" />
          </Col>
        </Row>
      </ProFormList>
    </>
  );
};

export default HeaderSettings;
