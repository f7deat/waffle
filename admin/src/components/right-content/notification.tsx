import { BellOutlined } from "@ant-design/icons";
import { Link } from "@umijs/max";

const NotificationBell: React.FC = () => {
    return (
        <>
            <Link to={`/user/notification`}>
                <BellOutlined className="text-lg" />
            </Link>
        </>
    )
}

export default NotificationBell;