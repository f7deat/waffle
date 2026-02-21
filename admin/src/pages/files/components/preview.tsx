import { Drawer, DrawerProps, Image } from "antd";
import { formatFileSize } from "../utils";
import { ProDescriptions } from "@ant-design/pro-components";

type Props = DrawerProps & {
    file?: API.FileListItem | null;
}

const FilePreview: React.FC<Props> = (props) => {
    return (
        <Drawer {...props} title="File Preview" width={600}>
            <div className="border mb-2 rounded p-1 bg-gray-50">
                <Image src={props.file?.url} alt={props.file?.name} style={{ maxWidth: '100%' }} />
            </div>
            <ProDescriptions column={1} bordered size="small">
              <ProDescriptions.Item label="Tên tệp">{props.file?.name}</ProDescriptions.Item>
              <ProDescriptions.Item label="Kích thước">{props.file ? formatFileSize(props.file.size) : 'N/A'}</ProDescriptions.Item>
              <ProDescriptions.Item label="Loại tệp">{props.file?.type || 'N/A'}</ProDescriptions.Item>
            </ProDescriptions>
        </Drawer>
    )
}

export default FilePreview;