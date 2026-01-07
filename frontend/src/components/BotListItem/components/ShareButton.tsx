import {
  FacebookFilled,
  HeartFilled,
  HeartOutlined,
  LinkedinFilled,
  ShareAltOutlined,
  TwitterCircleFilled,
  MenuOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Button, Dropdown, MenuProps, message } from "antd";
import { useState, useEffect } from "react";
import styles from "./ShareButton.module.scss";
import {
  useFavoriteAppControllerAddFavoriteAppMutation,
  useFavoriteAppControllerRemoveFavoriteAppMutation,
} from "@app/services/api/favoriteApp/favoriteApp";
import { GetMezonAppDetailsResponse } from "@app/services/api/mezonApp/mezonApp.types";
import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import { IUserStore } from "@app/store/user";
import { cn } from "@app/utils/cn";

type ShareButtonProps = {
  data: GetMezonAppDetailsResponse;
  url: string;
};

const ShareButton = ({ data, url }: ShareButtonProps) => {
  const { t } = useTranslation(["components"]);
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user);
  const [isFavorited, setIsFavorited] = useState(data.isFavorited);
  
  const [addFavorite, { isLoading: isAdding }] = useFavoriteAppControllerAddFavoriteAppMutation();
  const [removeFavorite, { isLoading: isRemoving }] = useFavoriteAppControllerRemoveFavoriteAppMutation();

  useEffect(() => {
    setIsFavorited(data.isFavorited);
  }, [data.isFavorited]);

  const handleToggleFavorite = async () => {
    if (!userInfo?.id) {
      message.warning(t("component.share_button.login_required"));
      return;
    }

    const newState = !isFavorited;
    setIsFavorited(newState);

    try {
      if (newState) {
        await addFavorite({ id: data.id }).unwrap();
        message.success(t("component.share_button.added_favorite"));
      } else {
        await removeFavorite({ id: data.id }).unwrap();
        message.success(t("component.share_button.removed_favorite"));
      }
    } catch (error) {
      setIsFavorited(!newState);
      message.error(t("component.share_button.error"));
    }
  };

  const handleShareSocial = (platformUrl: string) => {
    window.open(platformUrl, "_blank");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "favorite",
      label: isFavorited ? t("component.share_button.remove_favorite") : t("component.share_button.add_favorite"),
      icon: isFavorited ? <HeartFilled className="!text-red-500 !text-sm" /> : <HeartOutlined className="!text-red-500 !text-sm" />,
      onClick: handleToggleFavorite,
      disabled: isAdding || isRemoving,
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
          onClick: () =>
            handleShareSocial(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
            ),
        },
        {
          key: "twitter",
          label: t("component.share_button.twitter"),
          icon: <TwitterCircleFilled className="!text-blue-400 !text-sm" />,
          onClick: () =>
            handleShareSocial(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${data.name} ${url}`
              )}`
            ),
        },
        {
          key: "linkedin",
          label: t("component.share_button.linkedin"),
          icon: <LinkedinFilled className="!text-blue-700 !text-sm" />,
          onClick: () =>
            handleShareSocial(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
            ),
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