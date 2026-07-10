import FormEditor from "@/components/editorjs/form-editor";
import { apiJobOpportunityDetail, apiJobOpportunityUpdate } from "@/services/careers/job";
import { PageContainer, ProCard, ProForm, ProFormInstance, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components"
import { useParams, useRequest } from "@umijs/max";
import { JOB_STATUS_OPTIONS, JOB_TYPE_OPTIONS } from "../../utils/constants";
import { useEffect, useRef } from "react";
import { message } from "antd";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { data, loading } = useRequest(() => apiJobOpportunityDetail(id!), {
        ready: !!id
    });

    const formRef = useRef<ProFormInstance>(null);

    useEffect(() => {
        if (data) {
            formRef.current?.setFieldsValue({
                id: data.id,
                title: data.title,
                description: data.description,
                jobType: data.jobType,
                status: data.status
            })
        }
    }, [data]);

    const onFinish = async (values: any) => {
        await apiJobOpportunityUpdate(values);
        message.success("Cập nhật thành công");
        return true;
    }

    return (
        <PageContainer title={data?.title}>
            <ProCard>
                <ProForm formRef={formRef} onFinish={onFinish} loading={loading}>
                    <ProFormText name="id" hidden />
                    <ProFormText name="title" label="Tiêu đề" />
                    <ProFormTextArea name="description" label="Mô tả" />
                    <FormEditor name="jobDetail" label="Chi tiết công việc" initialValue={data?.detail} />
                    <ProFormSelect name="jobType" label="Loại công việc" options={JOB_TYPE_OPTIONS} />
                    <ProFormSelect name="status" label="Trạng thái" options={JOB_STATUS_OPTIONS} />
                </ProForm>
            </ProCard>
        </PageContainer>
    )
}

export default Index;