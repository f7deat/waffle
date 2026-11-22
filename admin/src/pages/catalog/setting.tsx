import { apiCatalogDetail, saveCatalog } from '@/services/catalog';
import ImageLibraryPicker from '@/components/image-library/picker';
import { UploadOutlined } from '@ant-design/icons';
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
import FormCatalogList from '@/components/form/catalog-list';
import ImagePicker from '@/components/image-library/picker';

type Props = {
  catalog?: API.Catalog;
  reload?: Function
}

const CatalogSetting: React.FC<Props> = ({ catalog, reload }) => {
  const { id } = useParams();
  const [form] = ProForm.useForm();

  const formRef = useRef<ProFormInstance>(undefined);
  const thumbnail = ProForm.useWatch('thumbnail', form);
  const [openImagePicker, setOpenImagePicker] = useState(false);

  useEffect(() => {
    if (id) {
      apiCatalogDetail(id).then((response) => {
        formRef.current?.setFieldsValue(response.data);
      });
    }
  }, [id]);

  const onFinish = async (values: API.Catalog) => {
    values.type = Number(values.type);
    const response = await saveCatalog(values);
    if (response.succeeded) {
      message.success('Saved!');
      reload?.();
    }
  };

  return (
    <div>
      <ProForm formRef={formRef} onFinish={onFinish} form={form}>
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
        <ProFormText name="thumbnail" label="Thumbnail" />
        <div className="border border-gray-300 rounded p-1 mb-2">
          <img src={thumbnail} alt="Thumbnail" className="w-full h-52 rounded object-cover" />
        </div>
        <Button type="dashed" block className="mb-4" onClick={() => setOpenImagePicker(true)}>Chọn từ thư viện ảnh</Button>
      </ProForm>
      <ImagePicker
        open={openImagePicker}
        onOpenChange={setOpenImagePicker}
        value={thumbnail}
        onChange={(url) => formRef.current?.setFieldValue('thumbnail', url)}
      />
    </div>
  );
};

export default CatalogSetting;
