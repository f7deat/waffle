import { apiAddFolder } from "@/services/folder";
import { FolderAddOutlined } from "@ant-design/icons";
import { ModalForm, ProFormText } from "@ant-design/pro-components"
import { Button, message } from "antd"
import { useState } from "react";

type Props = {
    reload?: any;
    parentId?: string;
}

const FolderForm: React.FC<Props> = ({ reload, parentId }) => {

    const [open, setOpen] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        try {
            await apiAddFolder({
                ...values,
                parentId: parentId || null
            });
            message.success('Succeeded!');
            setOpen(false);
            reload?.();
            return true;
        } catch (error: any) {
            message.error(error?.data?.message || 'Failed!');
            return false;
        }
    }

    return (
        <>
            <Button icon={<FolderAddOutlined />} type="primary" onClick={() => setOpen(true)}>New Folder</Button>
            <ModalForm open={open} onOpenChange={setOpen} onFinish={onFinish} title="Folder setting">
                <ProFormText name="name" label="Tên thư mục" rules={[
                    {
                        required: true
                    }
                ]} />
            </ModalForm>
        </>
    )
}

export default FolderForm;