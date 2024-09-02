import { ArrowUpOutlined } from "@ant-design/icons";
import { Button, message, UploadFile } from "antd";
import WfUpload from "./upload";
import { useState } from "react";
import { apiMultiUpload } from "@/services/file-service";

const ButtonUpload: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);

    const onFinish = async (files: UploadFile[]) => {
        const formData = new FormData();
        files.map(file => {
            formData.append('files', file as any)
        });
        await apiMultiUpload(formData);
        message.success('Tải lên thành công!');
    }

    return (
        <>
            <Button
                icon={<ArrowUpOutlined />}
                type="primary"
                onClick={() => setOpen(true)}
            >
                Upload
            </Button>
            <WfUpload open={open} onCancel={() => setOpen(false)} onFinish={onFinish} />
        </>
    )
}

export default ButtonUpload;