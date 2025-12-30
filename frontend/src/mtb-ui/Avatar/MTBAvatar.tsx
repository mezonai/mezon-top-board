import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { cn } from "@app/utils/cn";

interface AvatarProps {
    imgUrl: string;
    isAllowUpdate?: boolean;
    isUpdatingAvatar?: boolean;
}

const MTBAvatar: React.FC<AvatarProps> = ({ imgUrl, isAllowUpdate = false, isUpdatingAvatar = false }) => {
    return (
        <div className={cn("relative w-full group", isAllowUpdate ? "cursor-pointer" : "cursor-default")}>
            <img
                src={imgUrl}
                alt="avatar"
                className={cn(
                    "rounded-full w-full aspect-square object-cover bg-secondary",
                    isUpdatingAvatar && "opacity-50"
                )}
            />
            {isAllowUpdate && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                    {isUpdatingAvatar ? (
                        <Spin indicator={<LoadingOutlined className="text-white text-2xl" />} />
                    ) : (
                        <div className={cn(
                            "absolute inset-0 rounded-full flex items-center justify-center",
                            "bg-black/40 transition-opacity duration-200",
                            "opacity-0 group-hover:opacity-100"
                        )}>
                            <EditOutlined className="text-white text-lg" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MTBAvatar;