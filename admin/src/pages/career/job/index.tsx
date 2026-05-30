import { apiDeleteJobOpportunity, apiJobOpportunityList, apiSaveJobOpportunity } from "@/services/careers/job";
import TiptapEditor from "@/components/tiptap";
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
import { useRef, useState } from "react";

interface JobOpportunityItem {
    id: string;
    salaryRange?: string;
    jobLocation?: string;
    jobType: number;
    jobRequirements?: string;
    jobDetail?: string;
    createdDate?: string;
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
    const [job, setJob] = useState<JobOpportunityItem | null>(null);

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
            title: "Noi lam viec",
            dataIndex: "jobLocation"
        },
        {
            title: "Loai hinh",
            dataIndex: "jobType",
            valueType: "select",
            valueEnum: jobTypeValueEnum,
            fieldProps: {
                options: jobTypeOptions
            }
        },
        {
            title: "Muc luong",
            dataIndex: "salaryRange",
            search: false
        },
        {
            title: "So don",
            dataIndex: "applicationCount",
            search: false,
            align: "center"
        },
        {
            title: "Ngay tao",
            dataIndex: "createdDate",
            valueType: "dateTime",
            search: false
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
                        setJob(record);
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
                        setJob(null);
                        setOpenForm(true);
                    }}
                >
                    Them viec lam
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
                onOpenChange={(visible) => {
                    setOpenForm(visible);
                    if (!visible) {
                        setJob(null);
                    }
                }}
                title={job?.id ? "Cap nhat viec lam" : "Them viec lam"}
                initialValues={
                    job
                        ? {
                            id: job.id,
                            salaryRange: job.salaryRange,
                            jobLocation: job.jobLocation,
                            jobType: job.jobType,
                            jobRequirements: job.jobRequirements,
                            jobDetail: job.jobDetail
                        }
                        : {
                            jobType: 0
                        }
                }
                onFinish={async (values) => {
                    await apiSaveJobOpportunity({
                        ...values,
                        id: job?.id
                    });
                    message.success(job?.id ? "Cap nhat viec lam thanh cong" : "Them viec lam thanh cong");
                    actionRef.current?.reload();
                    setJob(null);
                    return true;
                }}
            >
                <ProFormText name="id" hidden />
                <ProFormText
                    name="salaryRange"
                    label="Muc luong"
                    rules={[{ required: true, message: "Vui long nhap muc luong" }]}
                />
                <ProFormText
                    name="jobLocation"
                    label="Noi lam viec"
                    rules={[{ required: true, message: "Vui long nhap noi lam viec" }]}
                />
                <ProFormSelect
                    name="jobType"
                    label="Loai hinh cong viec"
                    options={jobTypeOptions}
                    rules={[{ required: true, message: "Vui long chon loai hinh cong viec" }]}
                />
                <ProForm.Item
                    name="jobDetail"
                    label="Chi tiet cong viec"
                >
                    <TiptapEditor placeholder="Nhap chi tiet cong viec..." />
                </ProForm.Item>
                <ProFormTextArea name="jobRequirements" label="Yeu cau cong viec" />
            </ModalForm>
        </PageContainer>
    );
};

export default Index;
