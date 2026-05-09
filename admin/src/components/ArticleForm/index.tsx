import { addArticle } from '@/services/article';
import { DrawerForm, DrawerFormProps, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

interface ArticleFormProps extends DrawerFormProps {
  open: boolean;
  onSuccess?: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSuccess, ...drawerFormProps }) => {

  const handleSubmit = async (values: any) => {
    await addArticle({
      name: values.name,
      description: values.description
    });
    onSuccess?.();
    return true;
  }

  return (
    <DrawerForm
      title='Create Article'
      onFinish={handleSubmit}
      {...drawerFormProps}
    >
      <ProFormText name="name" label="Name" rules={[{ required: true }]} />

      <ProFormTextArea
        name="description"
        label="Description"
      />

    </DrawerForm>
  );
};

export default ArticleForm;
