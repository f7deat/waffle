import { listFile } from '@/services/file-service';
import {
    BarsOutlined,
    DeleteOutlined,
    EyeOutlined,
    FileGifOutlined,
    FileImageTwoTone,
    FileTextTwoTone,
    HomeOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history } from '@umijs/max';
import {
    Breadcrumb,
    Button,
    Col,
    Dropdown,
    Modal,
    Popconfirm,
    Row,
    Space
} from 'antd';
import { useRef, useState } from 'react';
import WfUpload from './upload';

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
            valueType: 'indexBorder'
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Date modified',
            dataIndex: 'modifiedDate',
            search: false
        },
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Size',
            dataIndex: 'size',
            search: false
        },
        {
            title: 'Action',
            valueType: 'option',
            render: (_, row) => (
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
                    }}
                >
                    <Button icon={<BarsOutlined />} type="link" size="small" />
                </Dropdown>
            ),
        }
    ]

    return (
        <Modal
            title="File Explorer"
            open={props.open}
            onCancel={() => props.onOpenChange()}
            centered
            width={1100}
            footer={false}
        >
            <div className='flex items-center justify-between'>
                <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">Home</Breadcrumb.Item>
                </Breadcrumb>
                <div>
                    <Button icon={<UploadOutlined />} type='primary' onClick={() => setOpen(true)}>Upload</Button>
                </div>
            </div>
            <Row gutter={16}>
                <Col md={4}>
                    {
                        categories.map(category => (
                            <div key={category.key} className='hover-light'>
                                <Button type='link' icon={category.icon}>{category.name}</Button>
                            </div>
                        ))
                    }
                </Col>
                <Col md={20}>
                    <ProTable<API.FileContent>
                        rowSelection={{}}
                        size='small'
                        columns={columns}
                        search={{
                            layout: 'vertical'
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
                </Col>
            </Row>
            <WfUpload open={open} onCancel={() => setOpen(false)} onFinish={() => {
                actionRef.current?.reload();
                setOpen(false);
            }} />
        </Modal>
    );
};

export default FileExplorer;
