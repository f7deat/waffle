import FormCatalogList from '@/components/form/catalog-list';
import ProFormLink from '@/components/link';
import { saveSetting } from '@/services/setting';
import { FacebookOutlined, InstagramOutlined, PlusOutlined, XOutlined, YoutubeOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormInstance,
  ProFormText,
  ProList,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Button, Col, Divider, message, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';

type Props = {
  data?: any;
  onFinish: any;
}

const Footer: React.FC<Props> = ({ data, onFinish }) => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance>();
  const [open, setOpen] = useState<boolean>(false);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      formRef.current?.setFields([
        {
          name: 'companyName',
          value: data.companyName,
        },
        {
          name: 'email',
          value: data.email,
        },
        {
          name: 'phoneNumber',
          value: data.phoneNumber,
        },
        {
          name: 'viewName',
          value: data.viewName,
        },
        {
          name: 'facebookUrl',
          value: data.social?.facebookUrl
        },
        {
          name: 'instagramUrl',
          value: data.social?.instagramUrl
        },
        {
          name: 'youtubeUrl',
          value: data.social?.youtubeUrl
        },
        {
          name: 'xUrl',
          value: data.social?.xUrl
        }
      ]);
    }
  }, []);

  return (
    <ProForm formRef={formRef} onFinish={async (values) => {
      const body = {
        email: values.email,
        phoneNumber: values.phoneNumber,
        companyName: values.companyName,
        social: {
          facebookUrl: values.facebookUrl,
          instagramUrl: values.instagramUrl,
          youtubeUrl: values.youtubeUrl,
          xUrl: values.xUrl
        }
      }
      await onFinish(body);
    }}>
      <ProFormText name="id" initialValue={id} hidden />
      <Row gutter={16}>
        <Col md={18}>
          <Row gutter={16}>
            <Col md={8}>
              <ProFormText name="companyName" label="Your company" />
            </Col>
            <Col md={8}>
              <ProFormText name="email" label="Email" />
            </Col>
            <Col md={8}>
              <ProFormText name="phoneNumber" label="Phone number" />
            </Col>
            <Divider>Socials</Divider>
            <Col md={6}>
              <ProFormText name="facebookUrl" label="Facebook" fieldProps={{
                suffix: <FacebookOutlined />
              }} />
            </Col>
            <Col md={6}>
              <ProFormText name="instagramUrl" label="Instagram" fieldProps={{
                suffix: <InstagramOutlined />
              }} />
            </Col>
            <Col md={6}>
              <ProFormText name="youtubeUrl" label="Youtube" fieldProps={{
                suffix: <YoutubeOutlined />
              }} />
            </Col>
            <Col md={6}>
              <ProFormText name="xUrl" label="X" fieldProps={{
                suffix: <XOutlined />
              }} />
            </Col>
          </Row>
        </Col>
        <Col md={6}>
          <ProList
            dataSource={links}
            ghost headerTitle="Liên kết" toolBarRender={() => [<Button type='dashed' key="new" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Thêm</Button>]} />
        </Col>
      </Row>
      <ModalForm open={open} onOpenChange={setOpen} title="Thêm liên kết" onFinish={async (values: any) => {
        console.log(values);
      }}>
        <ProFormLink name="url" label="URL" />
      </ModalForm>
    </ProForm>
  );
};

export default Footer;
