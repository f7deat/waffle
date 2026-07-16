import { apiDistrictOptions } from "@/services/locations/district";
import { apiPlaceCreate, apiPlaceDelete, apiPlaceDetails, apiPlaceList, apiPlaceUpdate, IPlaceListItem } from "@/services/locations/place";
import { apiProvinceOptions } from "@/services/locations/province";
import { apiInfluencerOptions } from "@/services/user";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProColumns, ProFormInstance, ProFormSelect, ProFormText, ProFormTextArea, ProTable } from "@ant-design/pro-components"
import { Link } from "@umijs/max";
import { Button, Popconfirm, message } from "antd";
import { useEffect, useRef, useState } from "react";

const EMPTY_CONTENT = {
    blocks: [],
    time: Date.now(),
    version: "2.28.2"
};

const normalizeContent = (value: any) => {
    if (!value) return EMPTY_CONTENT;
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            return EMPTY_CONTENT;
        }
    }
    return value;
};

const Index: React.FC = () => {

    const actionRef = useRef<ActionType | undefined>(undefined);
    const editFormRef = useRef<ProFormInstance | undefined>(undefined);
    const [openCreate, setOpenCreate] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number>();
    const [currentPlace, setCurrentPlace] = useState<IPlaceListItem>();
    const [currentPlaceDetails, setCurrentPlaceDetails] = useState<any>();

    useEffect(() => {
        if (!openEdit) return;
        editFormRef.current?.setFieldsValue({
            name: currentPlaceDetails?.name ?? currentPlace?.name,
            active: currentPlaceDetails?.active,
            description: currentPlaceDetails?.description,
            provinceId: selectedProvinceId,
            districtId: currentPlaceDetails?.districtId ?? currentPlace?.districtId,
            address: currentPlaceDetails?.address ?? currentPlace?.address,
            influencerId: currentPlaceDetails?.influencerId,
        });
    }, [openEdit, currentPlace, currentPlaceDetails, selectedProvinceId]);

    const columns: ProColumns<IPlaceListItem>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
            width: 30,
            align: 'center'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => <Link to={`/place/center/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            search: false,
        },
        {
            title: 'District',
            dataIndex: 'districtName',
            search: false,
        },
        {
            title: 'Province',
            dataIndex: 'provinceName',
            search: false,
        },
        {
            title: 'Last Updated',
            dataIndex: 'modifiedDate',
            valueType: 'dateTime',
            width: 180,
            search: false,
            sorter: true,
        },
        {
            title: <SettingOutlined />,
            valueType: 'option',
            width: 130,
            align: 'center',
            render: (_, record) => [
                <Link key="view" to={`/place/center/${record.id}`}>
                    <Button type="primary" icon={<EyeOutlined />} size="small" />
                </Link>,
                <Button
                    key="edit"
                    size="small"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={async () => {
                        try {
                            const placeResp = await apiPlaceDetails(record.id);
                            setCurrentPlaceDetails(placeResp);
                            setCurrentPlace(record);
                            setSelectedProvinceId(placeResp?.provinceId);
                            setOpenEdit(true);
                        } catch {
                            message.error('Failed to load place details');
                        }
                    }}
                />,
                <Popconfirm
                    key="delete"
                    title="Are you sure you want to delete this place?"
                    onConfirm={async () => {
                        try {
                            await apiPlaceDelete(record.id);
                            message.success('Place deleted successfully');
                            actionRef.current?.reload();
                        } catch {
                            message.error('Failed to delete place');
                        }
                    }}
                >
                    <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ]
        }
    ];

    const handleCreate = async (values: any) => {
        await apiPlaceCreate({
            name: values.name,
            active: values.active,
            description: values.description,
        });
        message.success('Place created successfully');
        setOpenCreate(false);
        actionRef.current?.reload();
        return true;
    };

    const handleUpdate = async (values: any) => {
        if (!currentPlace) return false;
        await apiPlaceUpdate({
            id: currentPlace.id,
            name: values.name,
            active: values.active,
            description: values.description,
            districtId: values.districtId,
            address: values.address,
            influencerId: values.influencerId,
            content: JSON.stringify(normalizeContent(currentPlaceDetails?.content))
        });
        message.success('Place updated successfully');
        setOpenEdit(false);
        actionRef.current?.reload();
        return true;
    };

    return (
        <PageContainer>
            <ProTable<IPlaceListItem>
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                request={apiPlaceList}
                search={{
                    layout: 'vertical'
                }}
                headerTitle={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreate(true)}>
                        New Place
                    </Button>
                }
            />

            <ModalForm
                title="Create Place"
                open={openCreate}
                onOpenChange={setOpenCreate}
                onFinish={handleCreate}
                initialValues={{ active: true }}
                layout="vertical"
            >
                <ProFormText
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter place name' }]}
                />
                <ProFormTextArea name="description" label="Description" />
                <ProFormSelect
                    name="active"
                    label="Status"
                    options={[
                        { label: 'Published', value: true as any },
                        { label: 'Draft', value: false as any },
                    ]}
                    allowClear={false}
                />
            </ModalForm>

            <ModalForm
                title="Edit Place"
                open={openEdit}
                onOpenChange={setOpenEdit}
                onFinish={handleUpdate}
                layout="vertical"
                formRef={editFormRef}
            >
                <ProFormText
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter place name' }]}
                />
                <ProFormText name="description" label="Description" />
                <ProFormSelect
                    name="active"
                    label="Status"
                    options={[
                        { label: 'Published', value: true as any },
                        { label: 'Draft', value: false as any },
                    ]}
                    allowClear={false}
                />
                <ProFormSelect
                    name="provinceId"
                    label="Province"
                    showSearch
                    request={apiProvinceOptions}
                    fieldProps={{
                        onChange: (value) => {
                            const parsed = Number(value);
                            setSelectedProvinceId(Number.isNaN(parsed) ? undefined : parsed);
                        }
                    }}
                    initialValue={selectedProvinceId}
                />
                <ProFormSelect
                    name="districtId"
                    label="District"
                    showSearch
                    request={apiDistrictOptions}
                    params={{
                        provinceId: selectedProvinceId
                    }}
                    initialValue={currentPlace?.districtId}
                />
                <ProFormText name="address" label="Address" initialValue={currentPlace?.address} />
                <ProFormSelect
                    name="influencerId"
                    label="Influencer"
                    showSearch
                    request={apiInfluencerOptions}
                    initialValue={currentPlaceDetails?.influencerId}
                />
            </ModalForm>
        </PageContainer>
    )
}

export default Index