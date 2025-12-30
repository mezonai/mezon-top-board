import {
    FacebookFilled,
    LinkedinFilled,
    TwitterCircleFilled,
} from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { cn } from "@app/utils/cn";

type ShareButtonProps = {
    text: string;
    url: string;
};

const ShareButton = ({ text, url }: ShareButtonProps) => {
    const { t } = useTranslation();
    const shareOptions = [
        {
            label: t('component.share_button.facebook'),
            icon: <FacebookFilled className="text-lg" />,
            bgColor: "bg-blue-600",
            hoverColor: "hover:bg-blue-700",
            getUrl: () =>
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(text)}`,
        },
        {
            label: t('component.share_button.twitter'),
            icon: <TwitterCircleFilled className="text-lg" />,
            bgColor: "bg-blue-400",
            hoverColor: "hover:bg-blue-500",
            getUrl: () =>
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `${text} ${url}`
                )}`,
        },
        {
            label: t('component.share_button.linkedin'),
            icon: <LinkedinFilled className="text-lg" />,
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
        <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "p-3 w-full max-w-[250px]",
                "card-base"
            )}
        >
            <h3 className="text-heading-4 mb-3">{t('component.share_button.title')}</h3>
            <div className="flex flex-col gap-2">
                {shareOptions.map(({ label, icon, bgColor, hoverColor, getUrl }) => (
                    <button
                        key={label}
                        onClick={() => handleShare(getUrl)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg",
                            "text-white font-medium transition-base cursor-pointer",
                            bgColor,
                            hoverColor
                        )}
                    >
                        <span className="text-lg">{icon}</span>
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ShareButton;