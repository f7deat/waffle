import { apiMenuDelete, apiMenuList } from "@/services/menu";
import { ActionType, PageContainer, ProTable } from "@ant-design/pro-components"
import MenuForm from "./components/form";
import { useRef, useState } from "react";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const MenuPage: React.FC = () => {

    const actionRef = useRef<ActionType>();
    const [menu, setMenu] = useState<any>();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <PageContainer extra={(<MenuForm open={open} id={menu?.id} onOpenChange={setOpen} reload={() => {
            actionRef.current?.reload();
        }} />)}>
            <ProTable
                search={{
                    layout: 'vertical'
                }}
                columns={[
                    {
                        title: 'Name',
                        dataIndex: 'name'
                    },
                    {
                        title: 'Url',
                        dataIndex: 'url'
                    },
                    {
                        title: 'TT',
                        dataIndex: 'sortOrder',
                        search: false,
                        valueType: 'digit',
                        width: 80
                    },
                    {
                        title: 'Active',
                        dataIndex: 'active',
                        valueEnum: {
                            true: {
                                text: 'Active',
                                status: 'Processing'
                            },
                            false: {
                                text: 'Draft',
                                status: 'Default'
                            }
                        }
                    },
                    {
                        title: 'Options',
                        valueType: 'option',
                        render: (_, entity) => [
                            <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => {
                                setMenu(entity);
                                setOpen(true);
                            }} />,
                            <Popconfirm key="delete" title="Are you sure?" onConfirm={async () => {
                                await apiMenuDelete(entity.id);
                                message.success('Xóa thành công!');
                                actionRef.current?.reload();
                            }}>
                                <Button type="primary" size="small" icon={<DeleteOutlined />} danger />
                            </Popconfirm>
                        ],
                        width: 100
                    }
                ]}
                actionRef={actionRef}
                request={apiMenuList}
                rowKey="id"
            />
        </PageContainer>
    )
}

export default MenuPage;