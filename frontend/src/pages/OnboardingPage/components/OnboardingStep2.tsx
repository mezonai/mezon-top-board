import { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Input, Spin, Tooltip } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import MtbTypography from '@app/mtb-ui/Typography/Typography';
import FormField from '@app/components/FormField/FormField'; 
import { errorStatus } from '@app/constants/common.constant';
import { SelfUpdateUserRequest } from '@app/services/api/user/user.types';
import { 
  useUserControllerGetUserDetailsQuery, 
  useUserControllerSelfUpdateUserMutation 
} from '@app/services/api/user/user';
import MtbButton from '@app/mtb-ui/Button';
import MediaManagerModal from '@app/components/MediaManager/MediaManager';
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media';
import { getUrlMedia } from '@app/utils/stringHelper';
import MTBAvatar from '@app/mtb-ui/Avatar/MTBAvatar';
import defaultAvatar from '@app/assets/images/default-user.webp';

interface Props {
  onSubmitSuccess: () => void;
}

function OnboardingStep2({ onSubmitSuccess }: Props) {
  const { data: userResponse, isLoading: isLoadingUser } = useUserControllerGetUserDetailsQuery();
  const [updateUser, { isLoading: isUpdating }] = useUserControllerSelfUpdateUserMutation();
  const [uploadImage, { isLoading: isUploadingAvatar }] = useMediaControllerCreateMediaMutation();
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const methods = useForm<SelfUpdateUserRequest>();
  const { control, handleSubmit, reset, formState: { errors }, setValue, watch } = methods;
  const profileImageValue = watch('profileImage');
  const bioValue = watch('bio', '');
  const avatarUrl = profileImageValue ? getUrlMedia(profileImageValue) : defaultAvatar;

  useEffect(() => {
    if (userResponse?.data) {
      reset({
        name: userResponse.data.name || '',
        bio: userResponse.data.bio || '',
        profileImage: userResponse.data.profileImage || '',
      }, { keepDirtyValues: true });
    }
  }, [userResponse, reset]);

  const onSubmit = async (formData: SelfUpdateUserRequest) => {
    try {
      await updateUser({ selfUpdateUserRequest: formData }).unwrap();
      toast.success('Profile updated successfully!');
      
      onSubmitSuccess(); 
      
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  const handleChooseMedia = (chosen: string) => {
    setValue('profileImage', chosen, { shouldDirty: true, shouldValidate: true });
    setIsMediaManagerOpen(false);
  };

  if (isLoadingUser) {
    return <div className='text-center'><Spin /></div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-start justify-between mb-6 gap-4 flex-wrap'>
          <div className='flex items-center gap-3'>
            <div>
              <MtbTypography variant='h2' customClassName='text-primary mb-0'>
                Profile Information
              </MtbTypography>
              <MtbTypography variant='p' customClassName='text-secondary text-sm mt-0 !font-normal'>
                Your information has been pre-filled from your Mezon account
              </MtbTypography>
            </div>
          </div>
          <span className='px-3 py-1 text-xs rounded-full bg-primary-100 text-primary h-fit'>From Mezon</span>
        </div>

        <div className='flex flex-col items-center mb-4'>
          <div className='relative group w-[130px] h-[130px] flex items-center justify-center'>
            <div onClick={() => setIsMediaManagerOpen(true)} className='cursor-pointer inline-block'>
              <MTBAvatar
                imgUrl={avatarUrl}
                isAllowUpdate={true}
                isUpdatingAvatar={isUploadingAvatar}
              />
            </div>
            <Tooltip title='Upload new photo'>
              <button
                type='button'
                onClick={() => setIsMediaManagerOpen(true)}
                className='absolute bottom-1 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors'
              >
                <CameraOutlined />
              </button>
            </Tooltip>
          </div>
        </div>

        <FormField label='Display Name *' errorText={errors.name?.message}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder='Alex Johnson' status={errorStatus(errors.name)} />
            )}
          />
          <p className='text-xs text-secondary mt-1'>3-50 characters. This is how others will see your name.</p>
        </FormField>
        
        <FormField label='Email'>
          <Input value={userResponse?.data?.email} className='!text-secondary' disabled />
        </FormField>
        
        <FormField label='Bio (Optional)' errorText={errors.bio?.message}>
          <Controller
            name='bio'
            control={control}
            render={({ field }) => (
              <Input.TextArea {...field} rows={3} placeholder='Tell us about yourself...' />
            )}
          />
          <div className='flex justify-between text-xs text-secondary mt-1'>
            <span>Share a short introduction.</span>
            <span>{bioValue?.length}/500 characters</span>
          </div>
        </FormField>
        
        <div className='flex justify-end mt-8'>
          <MtbButton
            type='primary'
            color='primary'
            variant='solid'
            loading={isUpdating}
            disabled={isUpdating}
            onClick={() => handleSubmit(onSubmit)()}
            className='hover:bg-primary text-sm p-5'
          >
            Save & Continue
          </MtbButton>
        </div>

        <MediaManagerModal
          isVisible={isMediaManagerOpen}
          onChoose={handleChooseMedia}
          onClose={() => setIsMediaManagerOpen(false)}
        />
      </form>
    </FormProvider>
  );
}

export default OnboardingStep2;