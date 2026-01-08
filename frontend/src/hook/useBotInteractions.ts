import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { IUserStore } from '@app/store/user';
import { getMezonInstallLink } from '@app/utils/mezonApp';
import { safeConcatUrl, getUrlMedia } from '@app/utils/stringHelper';
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types';
import { avatarBotDefault } from '@app/assets';

export const useBotInteractions = (data: GetMezonAppDetailsResponse) => {
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user);

  const isOwner = useMemo(() => {
    return !!(userInfo?.id && data?.owner?.id && userInfo.id === data.owner.id);
  }, [userInfo?.id, data?.owner?.id]);

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
    handleShareSocial,
    handleInvite,
    handleChatNow,
    fullShareUrl,
    isOwner,
    userInfo
  };
};