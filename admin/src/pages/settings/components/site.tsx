import ImageLibraryPicker from '@/components/image-library/picker';
import { ProForm, ProFormText } from '@ant-design/pro-components';

const SiteSettings: React.FC = () => {
  const form = ProForm.useFormInstance();

  return (
    <>
      <ProFormText name="name" label="Site Name" />
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
      <ProFormText name="description" label="Site Description" />
    </>
  );
};

export default SiteSettings;