import { apiAddFolder } from "@/services/folder";
import { FolderAddOutlined } from "@ant-design/icons";
import { ModalForm, ProFormText } from "@ant-design/pro-components"
import { Button, message } from "antd"
import { useState } from "react";

type Props = {
    reload?: any;
}

const FolderForm: React.FC<Props> = ({ reload }) => {

    const [open, setOpen] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        await apiAddFolder(values);
        message.success('Succeeded!');
        setOpen(false);
        reload?.();
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