import {
    FacebookFilled,
    LinkedinFilled,
    TwitterCircleFilled,
} from "@ant-design/icons";

type ShareButtonProps = {
    text: string;
    url: string;
};

const ShareButton = ({ text, url }: ShareButtonProps) => {
    const shareOptions = [
        {
            label: "Facebook",
            icon: <FacebookFilled style={{ fontSize: 18 }} />,
            bgColor: "bg-blue-600",
            hoverColor: "hover:bg-blue-700",
            getUrl: () =>
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(text)}`,
        },
        {
            label: "Twitter",
            icon: <TwitterCircleFilled style={{ fontSize: 18 }} />,
            bgColor: "bg-blue-400",
            hoverColor: "hover:bg-blue-500",
            getUrl: () =>
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `${text} ${url}`
                )}`,
        },
        {
            label: "LinkedIn",
            icon: <LinkedinFilled style={{ fontSize: 18 }} />,
            bgColor: "bg-blue-700",
            hoverColor: "hover:bg-blue-800",
            getUrl: () =>
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    url
                )}`,
        },
    ];

    const handleShare = (getUrl: () => string) => {
        window.open(getUrl(), "_blank");
    };

    return (
        <div onClick={(e) => e.stopPropagation()} className="p-2 w-full max-w-[250px]">
            <h3 className="text-base font-semibold mb-2">Share now</h3>
            <div className="flex flex-col gap-2 py-2">
                {shareOptions.map(({ label, icon, bgColor, hoverColor, getUrl }) => (
                    <button
                        key={label}
                        onClick={() => handleShare(getUrl)}
                        className={`flex items-center gap-2 p-2 ${bgColor} text-white rounded-lg ${hoverColor} cursor-pointer`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ShareButton;
