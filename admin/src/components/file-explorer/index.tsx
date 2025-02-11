import { listFile } from '@/services/file-service';
import {
    BarsOutlined,
    DeleteOutlined,
    EyeOutlined,
    FileGifOutlined,
    FileImageTwoTone,
    FileTextTwoTone,
    HomeOutlined,
    MoreOutlined,
    SelectOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history } from '@umijs/max';
import {
    Breadcrumb,
    Button,
    Dropdown,
    Modal,
    Popconfirm,
    Space
} from 'antd';
import { useRef, useState } from 'react';
import WfUpload from './upload';
import { formatFileSize } from '@/pages/files/utils';

type ExplorerProps = {
    open: boolean;
    onOpenChange?: any;
    onFinish?: any;
    onSelect?: any;
    type?: string[];
};

const FileExplorer: React.FC<ExplorerProps> = (props) => {
    const actionRef = useRef<ActionType>();
    const [open, setOpen] = useState<boolean>(false);

    const categories = [
        {
            key: 'images',
            name: 'Images',
            icon: <FileImageTwoTone twoToneColor={'#eb2f96'} />
        },
        {
            key: 'videos',
            name: 'Videos',
            icon: <FileGifOutlined />
        },
        {
            key: 'text',
            name: 'Documents',
            icon: <FileTextTwoTone twoToneColor={'#52c41a'} />
        }
    ]

    const columns: ProColumns<API.FileContent>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
            width: 30,
            align: 'center'
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Date modified',
            dataIndex: 'uploadDate',
            search: false,
            valueType: 'fromNow'
        },
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Size',
            dataIndex: 'size',
            search: false,
            render: (_, entity) => formatFileSize(entity.size),
            width: 100
        },
        {
            title: 'Action',
            valueType: 'option',
            render: (_, row) => [
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 1,
                                label: (
                                    <Space
                                        onClick={() =>
                                            history.push(`/files/center/${row.id}`)
                                        }
                                    >
                                        <EyeOutlined />
                                        <FormattedMessage id="general.preview" />
                                    </Space>
                                ),
                            },
                            {
                                key: 'select',
                                label: 'Select',
                                icon: <SelectOutlined />
                            },
                            {
                                key: 2,
                                label: (
                                    <Popconfirm title="Are you sure?">
                                        <Space>
                                            <DeleteOutlined />
                                            Delete
                                        </Space>
                                    </Popconfirm>
                                ),
                                danger: true,
                            },
                        ],
                        onClick: (info) => {
                            if (info.key === 'select') {
                                props.onSelect?.(row);
                                return;
                            }
                        }
                    }}
                >
                    <Button icon={<MoreOutlined />} type="dashed" size="small" />
                </Dropdown>
            ],
            width: 60
        }
    ]

    return (
        <Modal
            title={<div className='mb-4'>File Explorer</div>}
            styles={{
                body: {
                    padding: 0
                }
            }}
            open={props.open}
            onCancel={() => props.onOpenChange()}
            centered
            width={1100}
            footer={false}
        >
            <Breadcrumb className='p-1 bg-slate-100 px-2 border'>
                <Breadcrumb.Item href="">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">Home</Breadcrumb.Item>
            </Breadcrumb>
            <div className='flex border-b border-r border-l'>
                <div className='w-40 border-r'>
                    {
                        categories.map(category => (
                            <div key={category.key} className='hover-light'>
                                <Button type='link' icon={category.icon}>{category.name}</Button>
                            </div>
                        ))
                    }
                </div>
                <div className='flex-1 p-4'>
                    <ProTable<API.FileContent>
                        headerTitle={<Button icon={<UploadOutlined />} type='primary' onClick={() => setOpen(true)}>Upload</Button>}
                        rowSelection={{}}
                        size='small'
                        columns={columns}
                        search={{
                            filterType: 'light'
                        }}
                        request={(params) =>
                            listFile(
                                {
                                    ...params,
                                },
                                props.type,
                            )
                        }
                        pagination={{
                            defaultPageSize: 8
                        }}
                        actionRef={actionRef}
                        ghost
                    />
                </div>
            </div>
            <WfUpload open={open} onCancel={() => setOpen(false)} onFinish={() => {
                actionRef.current?.reload();
                setOpen(false);
            }} />
        </Modal>
    );
};

export default FileExplorer;
