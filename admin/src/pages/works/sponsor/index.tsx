import { saveArguments } from "@/services/work-content";
import { uuidv4 } from "@/utils/common";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { DragSortTable, ModalForm, ProColumns, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import { FormattedMessage, useParams } from "@umijs/max";
import { Avatar, Button, Popconfirm, Space, message } from "antd";
import { useEffect, useRef, useState } from "react"

type Props = {
    data: any;
}

const Sponsor: React.FC<Props> = ({ data }) => {

    const { id } = useParams();
    const [brands, setBrands] = useState<CPN.Brand[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const formRef = useRef<ProFormInstance>();

    useEffect(() => {
        if (data) {
            setBrands(data.brands || []);
        }
    }, [data]);

    const onFinish = async (values: CPN.Brand) => {
        let newBrands: CPN.Brand[] = brands;
        if (values.id) {
            const objIndex = newBrands.findIndex((obj => obj.id === values.id));
            newBrands[objIndex].name = values.name;
            newBrands[objIndex].url = values.url;
            newBrands[objIndex].logo = values.logo;
        } else {
            values.id = uuidv4();
            if (!newBrands) {
                newBrands = [];
            }
            newBrands.push(values);
        }
        const body = {
            brands: newBrands
        }
        const response = await saveArguments(id, body);
        if (response.succeeded) {
            setBrands(newBrands);
            message.success('Saved!');
            setOpen(false);
            formRef.current?.resetFields();
        }
    }

    const remove = async (brand: CPN.Brand) => {
        const newBrands = brands.filter(x => x.id !== brand.id);
        const body = {
            brands: newBrands
        }
        const response = await saveArguments(id, body);
        if (response.succeeded) {
            setBrands(newBrands);
            message.success('Deleted!');
        }
    }

    const columns: ProColumns<CPN.Brand>[] = [
        {
            title: '#',
            dataIndex: 'sort',
            className: 'drag-visible',
            search: false,
            width: 50,
            align: 'center'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (dom, entity) => (
                <Space>
                    <Avatar src={entity.logo} />
                    {dom}
                </Space>
            )
        },
        {
            title: 'Url',
            dataIndex: 'url',
            search: false
        },
        {
            title: 'Action',
            valueType: 'option',
            render: (dom, entity) => [
                <Button type="primary" icon={<EditOutlined />} size="small" key="edit" />,
                <Popconfirm
                    title="Are you sure?"
                    key={4}
                    onConfirm={() => remove(entity)}
                >
                    <Button
                        icon={<DeleteOutlined />} size="small"
                        danger
                        type="primary"
                    ></Button>
                </Popconfirm>
            ],
            width: 80
        }
    ];

    const handleDragSortEnd = async (beforeIndex: number, afterIndex: number, newDataSource: CPN.Brand[]) => {
        const body = {
            brands: newDataSource
        }
        const response = await saveArguments(id, body);
        if (response.succeeded) {
            setBrands(newDataSource);
            message.success('Saved!');
        }
    };

    return (
        <>
            <DragSortTable
                toolBarRender={() => [
                    <Button icon={<PlusOutlined />} key="add" type="link" onClick={() => setOpen(true)} />
                ]}
                dataSource={brands}
                columns={columns}
                search={{
                    layout: "vertical"
                }}
                rowKey="id"
                dragSortKey="sort"
                onDragSortEnd={handleDragSortEnd}
            />
            <ModalForm onFinish={onFinish} open={open} formRef={formRef} onOpenChange={setOpen} title={<FormattedMessage id="menu.component.sponsor" />}>
                <ProFormText name="id" label="Id" disabled />
                <ProFormText name="name" label="Name" />
                <ProFormText name="logo" label="Logo" />
                <ProFormText name="url" label="Url" />
            </ModalForm>

        </>
    )
}

export default Sponsor