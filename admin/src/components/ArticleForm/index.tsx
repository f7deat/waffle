import { addArticle } from '@/services/article';
import { ModalForm, ModalFormProps, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

interface ArticleFormProps extends ModalFormProps {
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
    <ModalForm
      title='Tạo mới'
      onFinish={handleSubmit}
      {...drawerFormProps}
    >
      <ProFormText name="name" label="Name" rules={[{ required: true }]} />

      <ProFormTextArea
        name="description"
        label="Description"
      />

    </ModalForm>
  );
};

export default ArticleForm;
