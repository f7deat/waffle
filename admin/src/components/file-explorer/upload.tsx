import { uploadFromUrl } from "@/services/file-service";
import { CloudUploadOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Modal, Upload, message } from "antd";
import { useState } from "react";

type WfUploadProps = {
    open: boolean;
    onFinish: any;
    onCancel: any;
}

const { Dragger } = Upload;

const WfUpload: React.FC<WfUploadProps> = (props) => {

    const [url, setUrl] = useState<string>('');

    function isValidHttpsUrl(input: string) {
        let url;
        try {
            url = new URL(input);
        } catch (_) {
            return false;
        }
        return url.protocol === "https:";
    }

    const fromUrl = async (url: string) => {
        if (!isValidHttpsUrl(url)) {
            message.error('Sorry, URL failed to upload.')
            return;
        }
        const response = await uploadFromUrl(url);
        if (response.succeeded) {
            message.success('Uploaded!');
        }
    };

    const onOk = async () => {
        if (!isValidHttpsUrl(url)) {
            message.error('Sorry, URL failed to upload.')
            return;
        }
        props.onFinish(url);
        props.onCancel();
    }

    return (
        <Modal open={props.open} onCancel={() => props.onCancel()} centered title="Upload" onOk={onOk}>
            <div className="mb-4">
                <Dragger>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
            </div>
            <div className="text-center">
                <Button icon={<CloudUploadOutlined />} type="link" size="large">
                    <b>Choose from your computer</b></Button>
            </div>
            <Divider>or</Divider>
            <Input placeholder="Paste image or URL" onChange={(e) => setUrl(e.currentTarget.value)} />
        </Modal>
    )
}

export default WfUpload;