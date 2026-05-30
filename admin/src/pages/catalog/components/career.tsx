import { apiSaveJobOpportunity } from "@/services/careers/job";
import TiptapEditor from "@/components/tiptap";
import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { message } from "antd";

const CareerSetting: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const onFinish = async (values: any) => {
        values.id = id;
        await apiSaveJobOpportunity(values);
        message.success('Cập nhật thông tin công việc thành công');
    }

    return (
        <>
            <ProForm onFinish={onFinish}>
                <ProFormText name="id" initialValue={id} hidden />
                <ProFormText label="Lương" name="salaryRange" />
                <ProFormText name="jobLocation" label="Nơi làm việc" />
                <ProFormSelect label="Loại hình công việc" name="jobType" options={[
                    {
                        label: 'Full-time',
                        value: 0
                    },
                    {
                        label: 'Part-time',
                        value: 1
                    },
                    {
                        label: 'Contract',
                        value: 2
                    },
                    {
                        label: 'Internship',
                        value: 3
                    }
                ]} rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn loại hình công việc'
                    }
                ]} initialValue={0} />
                <ProForm.Item name="jobDetail" label="Chi tiết công việc">
                    <TiptapEditor placeholder="Nhập chi tiết công việc..." />
                </ProForm.Item>
                <ProFormTextArea name="jobRequirements" label="Yêu cầu công việc" />
            </ProForm>
        </>
    )
}

export default CareerSetting;