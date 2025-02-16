import { saveCatalog } from '@/services/catalog';
import { FolderOutlined, UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useParams, getAllLocales } from '@umijs/max';
import { Button, Col, Row, Space, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import FormCatalogType from '@/components/form/catalog-type';
import FileExplorer from '@/components/file-explorer';
import FormCatalogList from '@/components/form/catalog-list';
import WfUpload from '@/components/file-explorer/upload';

type Props = {
  catalog?: API.Catalog;
  reload: Function
}

const CatalogSetting: React.FC<Props> = ({ catalog, reload }) => {
  const { id } = useParams();

  const formRef = useRef<ProFormInstance>();
  const [open, setOpen] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);

  useEffect(() => {
    if (catalog) {
      formRef.current?.setFields([
        {
          name: 'id',
          value: catalog.id,
        },
        {
          name: 'name',
          value: catalog.name,
        },
        {
          name: 'normalizedName',
          value: catalog.normalizedName,
        },
        {
          name: 'description',
          value: catalog.description,
        },
        {
          name: 'thumbnail',
          value: catalog.thumbnail,
        },
        {
          name: 'type',
          value: catalog.type,
        },
        {
          name: 'active',
          value: catalog.active,
        },
        {
          name: 'parentId',
          value: catalog.parentId
        },
        {
          name: 'locale',
          value: catalog.locale
        }
      ]);
    }
  }, [id]);

  const onFinish = async (values: API.Catalog) => {
    values.type = Number(values.type);
    const response = await saveCatalog(values);
    if (response.succeeded) {
      message.success('Saved!');
      reload();
    }
  };

  const onSelect = (values: API.FileContent) => {
    formRef.current?.setFieldValue('thumbnail', values.url);
    setOpen(false);
  }

  return (
    <div>
      <ProForm formRef={formRef} onFinish={onFinish}>
        <ProFormText name="id" hidden />
        <ProFormText name="name" label="Name" rules={[
          {
            required: true
          }
        ]} />
        <ProFormTextArea name="description" label="Description" rules={[
          {
            required: true
          }
        ]} />
        <Row gutter={16}>
          <Col span={8}>
            <FormCatalogType name="type" label="Type" />
          </Col>
          <Col span={8}>
            <ProFormSelect
              rules={[
                {
                  required: true
                }
              ]}
              options={getAllLocales().map(value => ({ label: value, value: value }))}
              name="locale" label="Locale" />
          </Col>
          <Col md={8} xs={12}>
            <ProFormSelect name="active" label="Active" rules={[
              {
                required: true
              }
            ]} options={[
              {
                label: 'Active',
                value: true as any
              },
              {
                label: 'Draft',
                value: false as any
              }
            ]} />
          </Col>
        </Row>
        <FormCatalogList name="parentId" label="Parent" type={catalog?.type} />
        <ProFormText name="thumbnail" label="Thumbnail" fieldProps={{
          addonAfter: <Space>
            <Button type='text' size='small' icon={<UploadOutlined />} onClick={() => setUpload(true)}>Upload</Button>
            <Button type='text' size='small' icon={<FolderOutlined />} onClick={() => setOpen(true)}>File explorer</Button>
          </Space>
        }} />
      </ProForm>
      <FileExplorer open={open} onOpenChange={setOpen} onSelect={onSelect} />
      <WfUpload open={upload} onCancel={setUpload} onFinish={() => { }} />
    </div>
  );
};

export default CatalogSetting;
