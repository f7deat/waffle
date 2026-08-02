import { addArticle } from '@/services/article';
import { ModalForm, ModalFormProps, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { history } from '@umijs/max';

const ArticleForm: React.FC<ModalFormProps> = (props) => {

  const handleSubmit = async (values: any) => {
    const response = await addArticle({
      name: values.name,
      description: values.description
    });
    history.push(`/article/${response.data.id}`);
    return true;
  }

  return (
    <ModalForm
      title='Tạo mới'
      onFinish={handleSubmit}
      {...props}
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
