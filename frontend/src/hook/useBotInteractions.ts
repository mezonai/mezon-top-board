import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { IUserStore } from '@app/store/user';
import {
  useFavoriteAppControllerAddFavoriteAppMutation,
  useFavoriteAppControllerRemoveFavoriteAppMutation,
} from '@app/services/api/favoriteApp/favoriteApp';
import { getMezonInstallLink } from '@app/utils/mezonApp';
import { safeConcatUrl, getUrlMedia } from '@app/utils/stringHelper';
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types';
import { avatarBotDefault } from '@app/assets';
import { ApiError } from '@app/types/API.types';

export const useBotInteractions = (data: GetMezonAppDetailsResponse) => {
  const { t } = useTranslation(['components']);
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user);

  const isOwner = useMemo(() => {
    return !!(userInfo?.id && data?.owner?.id && userInfo.id === data.owner.id);
  }, [userInfo?.id, data?.owner?.id]);

  const [isFavorited, setIsFavorited] = useState(data?.isFavorited);
  const [addFavorite, { isLoading: isAdding }] = useFavoriteAppControllerAddFavoriteAppMutation();
  const [removeFavorite, { isLoading: isRemoving }] = useFavoriteAppControllerRemoveFavoriteAppMutation();

  useEffect(() => {
    setIsFavorited(data?.isFavorited);
  }, [data?.isFavorited]);

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
      const apiError = error as ApiError;
      const errorMessage = apiError?.data?.message || t("component.share_button.error");
      message.error(errorMessage);
    }
  };

  const shareUrl = process.env.REACT_APP_SHARE_URL || 'https://top.mezon.ai/bot/';
  const fullShareUrl = safeConcatUrl(shareUrl, data?.id || '');

  const handleShareSocial = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    let url = '';
    const encodedUrl = encodeURIComponent(fullShareUrl);
    const encodedText = encodeURIComponent(`${data.name} ${fullShareUrl}`);

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    window.open(url, "_blank");
  };

  const inviteUrl = getMezonInstallLink(data?.type, data?.mezonAppId);
  const handleInvite = () => {
    window.open(inviteUrl, '_blank');
  };

  const handleChatNow = () => {
    if (!data?.mezonAppId) return;

    const payload = {
      id: data.mezonAppId,
      name: data.name || 'Unknown',
      avatar: data.featuredImage ? getUrlMedia(data.featuredImage) : avatarBotDefault
    };

    const dataBot = btoa(encodeURIComponent(JSON.stringify(payload)));
    const chatUrl = `https://mezon.ai/chat/${data.mezonAppId}?data=${dataBot}`;
    
    window.open(chatUrl, '_blank');
  };

  return {
    isFavorited,
    isBusy: isAdding || isRemoving,
    handleToggleFavorite,
    handleShareSocial,
    handleInvite,
    handleChatNow,
    fullShareUrl,
    isOwner,
    userInfo
  };
};