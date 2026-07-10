import { apiDeleteJobOpportunity, apiJobOpportunityAdd, apiJobOpportunityList } from "@/services/careers/job";
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import {
    ActionType,
    ModalForm,
    PageContainer,
    ProForm,
    ProColumns,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProTable
} from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { JOB_STATUS_OPTIONS } from "../utils/constants";
import { Link } from "@umijs/max";

interface JobOpportunityItem {
    id: string;
    salaryRange?: string;
    jobLocation?: string;
    jobType: number;
    jobRequirements?: string;
    jobDetail?: string;
    createdDate: string;
    modifiedDate?: string;
    applicationCount: number;
}

const jobTypeOptions = [
    { label: "Full-time", value: 0 },
    { label: "Part-time", value: 1 },
    { label: "Contract", value: 2 },
    { label: "Internship", value: 3 }
];

const jobTypeValueEnum = {
    0: { text: "Full-time" },
    1: { text: "Part-time" },
    2: { text: "Contract" },
    3: { text: "Internship" }
};

const Index: React.FC = () => {
    const actionRef = useRef<ActionType>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);

    const handleDelete = async (id: string) => {
        await apiDeleteJobOpportunity(id);
        message.success("Xoa viec lam thanh cong");
        actionRef.current?.reload();
    };

    const columns: ProColumns<JobOpportunityItem>[] = [
        {
            title: "#",
            valueType: "indexBorder",
            width: 30,
            align: "center"
        },
        {
            title: "Công việc",
            dataIndex: "title",
            render: (dom, record) => (
                <Link to={`/career/job/center/${record.id}`} className="font-semibold text-blue-500 hover:text-blue-700">
                    {dom}
                </Link>
            )
        },
        {
            title: "Loại hình",
            dataIndex: "jobType",
            valueType: "select",
            valueEnum: jobTypeValueEnum,
            fieldProps: {
                options: jobTypeOptions
            }
        },
        {
            title: "Số đơn",
            dataIndex: "applicationCount",
            search: false,
            valueType: "digit"
        },
        {
            title: 'Lượt xem',
            dataIndex: 'viewCount',
            search: false,
            align: 'center',
            valueType: 'digit'
        },
        {
            title: "Cập nhật cuối",
            dataIndex: "createdDate",
            valueType: "dateTime",
            search: false,
            render: (_, record) => (
                <div>
                    {dayjs(record.modifiedDate || record.createdDate).format("DD-MM-YYYY HH:mm")}
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            valueType: 'select',
            fieldProps: {
                options: JOB_STATUS_OPTIONS
            }
        },
        {
            title: <SettingOutlined />,
            valueType: "option",
            width: 90,
            align: "center",
            render: (_, record) => [
                <Button
                    key="edit"
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => {
                        setOpenForm(true);
                    }}
                />,
                <Popconfirm
                    key="delete"
                    title="Ban co chac chan muon xoa viec lam nay?"
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            ]
        }
    ];

    return (
        <PageContainer
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setOpenForm(true);
                    }}
                >
                    Tạo mới
                </Button>
            }
        >
            <ProTable<JobOpportunityItem>
                actionRef={actionRef}
                request={apiJobOpportunityList}
                rowKey="id"
                columns={columns}
                search={{
                    layout: "vertical"
                }}
            />
            <ModalForm
                open={openForm}
                onOpenChange={setOpenForm}
                title="Thêm việc làm"
                onFinish={async (values) => {
                    await apiJobOpportunityAdd(values);
                    message.success("Thêm việc làm thành công!");
                    actionRef.current?.reload();
                    return true;
                }}
            >
                <ProFormText
                    name="title"
                    label="Tên công việc"
                    rules={[{ required: true }]}
                />
                <ProFormTextArea
                    name="description"
                    label="Mô tả công việc"
                    rules={[{ required: true }]}
                />
                <ProFormSelect
                    name="jobType"
                    label="Loại hình công việc"
                    options={jobTypeOptions}
                    rules={[{ required: true }]}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default Index;
