import {
    apiAddUserToRole,
    apiRemoveUserFromRole,
    listRole,
    RoleListType,
} from "@/services/role";
import { apiGetUserRoles } from "@/services/user";
import { useRequest } from "@umijs/max";
import { useParams } from "@umijs/max";
import { Select, Space, Tag, Typography, message } from "antd";
import { useMemo, useState } from "react";

const ProfileRoles: React.FC = () => {
    const { id } = useParams();
    const [updatingRole, setUpdatingRole] = useState<string>();
    const { data: roleList, refresh } = useRequest(async () => {
        const response = await apiGetUserRoles(id);
        return response?.data || [];
    }, {
        refreshDeps: [id]
    });
    const { data: allRoles, loading: rolesLoading } = useRequest(async () => {
        const response = await listRole({ current: 1, pageSize: 100 });
        return response?.data || [];
    });

    const availableRoles = useMemo(() => {
        const assignedRoleIds = new Set((roleList || []).map((role) => role.id));
        return (allRoles || []).filter((role: RoleListType) => !assignedRoleIds.has(role.id));
    }, [allRoles, roleList]);

    const handleAddRole = async (roleName: string) => {
        if (!id || !roleName) {
            return;
        }

        setUpdatingRole(roleName);
        try {
            const response = await apiAddUserToRole({ id, roleName });
            if (!response?.succeeded) {
                message.error(response?.errors?.[0]?.description || response?.message || 'Không thể thêm vai trò.');
                return;
            }

            message.success('Đã thêm vai trò.');
            await refresh();
        } catch (error: any) {
            message.error(error?.data?.message || error?.message || 'Không thể thêm vai trò.');
        } finally {
            setUpdatingRole(undefined);
        }
    };

    const handleRemoveRole = async (role: RoleListType) => {
        if (!id || !role.name) {
            return;
        }

        setUpdatingRole(role.name);
        try {
            const response = await apiRemoveUserFromRole({ id, roleName: role.name });
            if (!response?.succeeded) {
                message.error(response?.errors?.[0]?.description || response?.message || 'Không thể xóa vai trò.');
                return;
            }

            message.success('Đã xóa vai trò.');
            await refresh();
        } catch (error: any) {
            message.error(error?.data?.message || error?.message || 'Không thể xóa vai trò.');
        } finally {
            setUpdatingRole(undefined);
        }
    };

    return (
        <div className="mt-4">
            <Typography.Text strong>Phân quyền</Typography.Text>
            <Space wrap className="mt-2 w-full">
                {roleList?.map((role) => (
                    <Tag
                        key={role.id}
                        color="blue"
                        closable={updatingRole !== role.name}
                        onClose={(event) => {
                            event.preventDefault();
                            handleRemoveRole(role);
                        }}
                    >
                        {role.displayName || role.name}
                    </Tag>
                ))}
                {!roleList?.length && <Typography.Text type="secondary">Chưa được gán vai trò</Typography.Text>}
            </Space>
            <Select
                className="mt-3 w-full"
                loading={rolesLoading}
                disabled={Boolean(updatingRole)}
                placeholder="Chọn vai trò để cấp quyền"
                value={undefined}
                options={availableRoles.map((role: RoleListType) => ({
                    label: role.displayName || role.name,
                    value: role.name,
                }))}
                onChange={handleAddRole}
                notFoundContent="Không còn vai trò để cấp"
            />
        </div>
    )
}

export default ProfileRoles