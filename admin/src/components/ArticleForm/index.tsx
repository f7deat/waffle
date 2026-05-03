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

interface ArticleFormProps {
  open: boolean;
  articleId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  open,
  articleId,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  const { data: articleData, loading: loadingArticle } = useRequest(
    () => getArticleById(articleId!),
    {
      ready: !!articleId && open,
      onSuccess: (res) => {
        if (res.succeeded && res.data) {
          form.setFieldsValue({
            name: res.data.name,
            description: res.data.description,
            content: res.data.content,
            thumbnail: res.data.thumbnail,
            locale: res.data.locale,
            publishedAt: res.data.publishedAt
              ? dayjs(res.data.publishedAt)
              : null,
          });
        }
      },
    }
  );

  const { loading: submitting, run: handleSubmit } = useRequest(
    async (values) => {
      if (articleId) {
        return updateArticle({
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
      } else {
        return addArticle({
          name: values.name,
          description: values.description,
          content: values.content,
          thumbnail: values.thumbnail,
          locale: values.locale,
          publishedAt: values.publishedAt
            ? values.publishedAt.toISOString()
            : null,
        });
      }
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res.succeeded) {
          message.success(
            articleId ? 'Article updated successfully' : 'Article created successfully'
          );
          form.resetFields();
          onSuccess();
          onClose();
        } else {
          message.error(res.errors?.[0]?.message || 'Operation failed');
        }
      },
      onError: (error) => {
        message.error(error.message || 'An error occurred');
      },
    }
  );

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Drawer
      title={articleId ? 'Edit Article' : 'Create Article'}
      placement="right"
      onClose={onClose}
      open={open}
      loading={loadingArticle}
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSubmit(values)}
        initialValues={{
          locale: 'vi-VN',
        }}
      >
        <Form.Item
          name="name"
          label="Article Name"
          rules={[
            { required: true, message: 'Please enter article name' },
            { min: 3, message: 'Name must be at least 3 characters' },
          ]}
        >
          <Input placeholder="Enter article name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea
            rows={3}
            placeholder="Enter article description"
          />
        </Form.Item>

        <Form.Item name="content" label="Content">
          <Input.TextArea rows={6} placeholder="Enter article content" />
        </Form.Item>

        <Form.Item name="thumbnail" label="Thumbnail URL">
          <Input placeholder="Enter thumbnail URL" />
        </Form.Item>

        <Form.Item
          name="locale"
          label="Locale"
          rules={[{ required: true, message: 'Please select locale' }]}
        >
          <Select
            options={[
              { label: 'Vietnamese', value: 'vi-VN' },
              { label: 'English', value: 'en-US' },
            ]}
          />
        </Form.Item>

        <Form.Item name="publishedAt" label="Published Date">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>

        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            {articleId ? 'Update' : 'Create'}
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default ArticleForm;
