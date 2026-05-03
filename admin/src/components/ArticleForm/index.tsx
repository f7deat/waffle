import { useRequest } from '@umijs/max';
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { addArticle, getArticleById, updateArticle } from '@/services/article';
import { DrawerForm, DrawerFormProps, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

interface ArticleFormProps extends DrawerFormProps {
  open: boolean;
  articleId?: string;
  onSuccess?: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ articleId, onSuccess, ...drawerFormProps }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    if (articleId) {
      await updateArticle({
        id: articleId,
        name: values.name,
        description: values.description,
        content: values.content,
        thumbnail: values.thumbnail,
        locale: values.locale,
        publishedAt: values.publishedAt
          ? values.publishedAt.toISOString()
          : null,
      });
      return true;
    } else {
      await addArticle({
        name: values.name,
        description: values.description
      });
      return true;
    }
  }

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <DrawerForm
      title={articleId ? 'Edit Article' : 'Create Article'} {...drawerFormProps}
      onFinish={handleSubmit}
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
