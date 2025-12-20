import { apiDistrictCreate } from "@/services/locations/district";
import { ModalForm, ModalFormProps, ProFormText } from "@ant-design/pro-components"
import { useParams } from "@umijs/max";
import { message } from "antd";

type Props = ModalFormProps & {
    data?: any;
    reload?: () => void;
}

const DistrictForm: React.FC<Props> = ({ data, reload, ...rest }) => {

    const { id } = useParams<{ id: string }>();

    const onFinish = async (values: any) => {
        await apiDistrictCreate({ ...values, 
            provinceId: id
         });
        message.success(data ? 'District updated successfully' : 'District created successfully');
        reload?.();
        return true;
    }

    return (
        <ModalForm {...rest} title={data ? "Edit District" : "Add District"} onFinish={onFinish}>
            <ProFormText name="name" label="District Name" placeholder="Enter district name" rules={[{ required: true, message: 'Please enter the district name' }]} />
        </ModalForm>
    )
}

export default DistrictForm;