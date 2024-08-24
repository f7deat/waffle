import FormCatalogList from '@/components/form/catalog-list';
import ProFormLink from '@/components/link';
import { saveSetting } from '@/services/setting';
import { DeleteOutlined, FacebookOutlined, InstagramOutlined, PlusOutlined, XOutlined, YoutubeOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormInstance,
  ProFormText,
  ProList,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Button, Col, Divider, message, Popconfirm, Row } from 'antd';
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
          name: 'address',
          value: data.address,
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
      if (data.links) {
        setLinks(data.links);
      }
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
        },
        links
      }
      await onFinish(body);
    }}>
      <ProFormText name="id" initialValue={id} hidden />
      <Row gutter={16} className='mb-4'>
        <Col md={18}>
          <div className='border rounded p-4 h-full'>
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
              <Col md={24}>
                <ProFormText name="address" label="Địa chỉ" />
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
                <ProFormText name="xUrl" label="X" tooltip="https://x.com" fieldProps={{
                  suffix: <XOutlined />
                }} />
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={6}>
          <div className='border rounded'>
            <div className='flex justify-between items-center p-2 border-b'>
              <div className='font-medium text-base'>Liên kết</div>
              <Button type='dashed' key="new" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Thêm</Button>
            </div>
            <ProList
              size='small'
              metas={{
                title: {
                  dataIndex: 'name'
                },
                actions: {
                  dataIndex: 'href',
                  render: (_, entity) => [
                    <Popconfirm key="delete" title="Are you sure?" onConfirm={() => {
                      setLinks(links.filter((x: any) => x.href !== entity.href));
                      message.success('Xóa thành công!');
                    }}>
                      <Button type='primary' size='small' danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  ]
                }
              }}
              dataSource={links}
              ghost />
          </div>
        </Col>
      </Row>
      <ModalForm open={open} onOpenChange={setOpen} title="Thêm liên kết" onFinish={async (values: any) => {
        if (links.find((x: any) => x.href === values.href)) {
          message.warning('URL đã tồn tại!');
          return;
        }
        setLinks([
          ...links,
          values
        ]);
        setOpen(false);
      }}>
        <ProFormLink name="href" label="URL" />
      </ModalForm>
    </ProForm>
  );
};

export default Footer;
