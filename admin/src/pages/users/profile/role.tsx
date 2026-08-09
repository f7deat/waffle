import { apiGetUserRoles } from "@/services/user";
import { useRequest } from "@umijs/max";
import { useParams } from "@umijs/max";
import { Tag } from "antd";

const ProfileRoles: React.FC = () => {
    const { id } = useParams();
    const { data: roleList } = useRequest(() => apiGetUserRoles(id), {
        refreshDeps: [id]
    });

    return (
        <>
            {roleList?.map((role) => (
                <Tag key={role.id} color="blue">
                    {role.displayName || role.name}
                </Tag>
            ))}
        </>
    )
}

export default ProfileRoles