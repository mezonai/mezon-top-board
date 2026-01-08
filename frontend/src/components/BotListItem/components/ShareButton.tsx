import {
    FacebookFilled,
    LinkedinFilled,
    TwitterCircleFilled,
    ShareAltOutlined,
    MenuOutlined,
    HeartFilled,
    HeartOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Button, Dropdown, MenuProps } from "antd";
import styles from './ShareButton.module.scss';
import { cn } from "@app/utils/cn";
import { useBotInteractions } from "@app/hook/useBotInteractions"; 
import { ShareButtonProps } from "./ShareButton.types";

const ShareButton = ({ data }: ShareButtonProps) => {
  const { t } = useTranslation(["components"]);
  
  const { isFavorited, isBusy, handleToggleFavorite, handleShareSocial } = useBotInteractions(data);

  const menuItems: MenuProps["items"] = [
    {
      key: "favorite",
      label: isFavorited ? t("component.share_button.remove_favorite") : t("component.share_button.add_favorite"),
      icon: isFavorited ? <HeartFilled className="!text-red-500 !text-sm" /> : <HeartOutlined className="!text-red-500 !text-sm" />,
      onClick: handleToggleFavorite,
      disabled: isBusy,
    },
    {
      key: "share",
      label: t("component.share_button.share"),
      icon: <ShareAltOutlined className="!text-blue-500 !text-sm"/>,
      popupClassName: styles.shareButton,
      children: [
        {
          key: "facebook",
          label: t("component.share_button.facebook"),
          icon: <FacebookFilled className="!text-blue-600 !text-sm" />,
          onClick: () => handleShareSocial('facebook'),
        },
        {
          key: "twitter",
          label: t("component.share_button.twitter"),
          icon: <TwitterCircleFilled className="!text-blue-400 !text-sm" />,
          onClick: () => handleShareSocial('twitter'),
        },
        {
          key: "linkedin",
          label: t("component.share_button.linkedin"),
          icon: <LinkedinFilled className="!text-blue-700 !text-sm" />,
          onClick: () => handleShareSocial('linkedin'),
        },
      ],
    },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown
        menu={{ items: menuItems }}
        overlayClassName={styles.shareButton}
        trigger={["click"]}
        placement="bottomRight"
        arrow
      >
        <Button
          size="large"
          color="default"
          variant="outlined"
          icon={<MenuOutlined className="!text-secondary" />}
          className={cn("bg-transparent border-border hover:bg-container-secondary")}
        />
      </Dropdown>
    </div>
  );
};

export default ShareButton;