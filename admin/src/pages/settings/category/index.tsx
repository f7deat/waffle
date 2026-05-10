import {
  apiCategoryCreate,
  apiCategoryDelete,
  apiCategoryGet,
  apiCategoryList,
  apiCategoryOptions,
  apiCategoryUpdate,
} from '@/services/settings/category';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Index: React.FC = () => {
    const actionRef = useRef<ActionType>(null);
    const formRef = useRef<ProFormInstance>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [category, setCategory] = useState<any>(null);

    useEffect(() => {
        if (category?.id) {
            apiCategoryGet(category.id).then((response) => {
                formRef.current?.setFieldsValue({
                    id: response.id,
                    name: response.name,
                    description: response.description,
                    parentId: response.parentId,
                    type: response.type,
                    locale: response.locale,
                });
            });
            return;
        }

        formRef.current?.setFieldsValue({
            type: 1,
            locale: 'vi-VN',
        });
    }, [category]);

    const onFinish = async (values: any) => {
        if (values.id) {
            await apiCategoryUpdate(values);
            message.success('Category updated successfully');
        } else {
            await apiCategoryCreate(values);
            message.success('Category created successfully');
        }

        actionRef.current?.reload();
        setCategory(null);
        return true;
    };

    const handleDelete = async (id: number) => {
        await apiCategoryDelete(id);
        message.success('Category deleted successfully');
        actionRef.current?.reload();
    };

    const renderType = (type: number) => {
        if (type === 2) {
            return <Tag color="blue">Product</Tag>;
        }
        return <Tag color="green">Article</Tag>;
    };

    return (
        <PageContainer
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setCategory(null);
                        setOpenForm(true);
                    }}
                >
                    Add Category
                </Button>
            }
        >
            <ProTable
                actionRef={actionRef}
                request={apiCategoryList}
                rowKey={'id'}
                columns={[
                    {
                        title: '#',
                        valueType: 'indexBorder',
                        width: 50,
                        align: 'center',
                        hideInSearch: true,
                    },
                    {
                        title: 'Name',
                        dataIndex: 'name',
                    },
                    {
                        title: 'Description',
                        dataIndex: 'description',
                        hideInSearch: true,
                        ellipsis: true,
                    },
                    {
                        title: 'Type',
                        dataIndex: 'type',
                        valueType: 'select',
                        valueEnum: {
                            1: { text: 'Article' },
                            2: { text: 'Product' },
                        },
                        render: (_, record) => renderType(record.type),
                    },
                    {
                        title: 'Parent',
                        dataIndex: 'parentName',
                        hideInSearch: true,
                        render: (_, record) => record.parentName || '-',
                    },
                    {
                        title: 'Locale',
                        dataIndex: 'locale',
                        width: 120,
                    },
                    {
                        title: <SettingOutlined />,
                        valueType: 'option',
                        width: 120,
                        align: 'center',
                        render: (_, record) => [
                            <Button
                                key="edit"
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setCategory(record);
                                    setOpenForm(true);
                                }}
                            />,
                            <Popconfirm
                                key="delete"
                                title="Are you sure you want to delete this category?"
                                onConfirm={() => handleDelete(record.id)}
                            >
                                <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
                            </Popconfirm>,
                        ],
                    },
                ]}
                search={{
                    layout: 'vertical',
                }}
            />

            <ModalForm
                formRef={formRef}
                title={category?.id ? 'Edit Category' : 'Add Category'}
                open={openForm}
                onOpenChange={(visible) => {
                    setOpenForm(visible);
                    if (!visible) {
                        setCategory(null);
                        formRef.current?.resetFields();
                    }
                }}
                onFinish={onFinish}
            >
                <ProFormDigit name="id" hidden />
                <ProFormText
                    name="name"
                    label="Category Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter category name',
                        },
                    ]}
                />
                <ProFormTextArea name="description" label="Description" fieldProps={{ rows: 4 }} />
                <ProFormSelect
                    name="type"
                    label="Type"
                    options={[
                        { label: 'Article', value: 1 },
                        { label: 'Product', value: 2 },
                    ]}
                    rules={[
                        {
                            required: true,
                            message: 'Please select category type',
                        },
                    ]}
                />
                <ProFormText
                    name="locale"
                    label="Locale"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter locale',
                        },
                    ]}
                />
                <ProFormSelect
                    name="parentId"
                    label="Parent Category"
                    allowClear
                    request={async ({ keyWords }) => {
                        const type = formRef.current?.getFieldValue('type');
                        const locale = formRef.current?.getFieldValue('locale');
                        const excludeId = formRef.current?.getFieldValue('id');
                        return apiCategoryOptions({
                            keyWords,
                            type,
                            locale,
                            excludeId,
                        });
                    }}
                />
            </ModalForm>
        </PageContainer>
    )
}

export default Index;