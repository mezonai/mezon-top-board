import FormField from '@app/components/FormField/FormField'
import { useMezonAppSearch } from '@app/hook/useSearch'
import Button from '@app/mtb-ui/Button'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useUserControllerSelfUpdateUserMutation } from '@app/services/api/user/user'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import { Divider, Form, Input } from 'antd'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { CardInfo } from './components'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import { yupResolver } from '@hookform/resolvers/yup'
import { getProfileSettingSchema } from '@app/validations/profileSetting.validations'
import { useTranslation } from "react-i18next";

function SettingPage() {
  const { t } = useTranslation();
  const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)
  const [selfUpdate, { isLoading: isUpdating }] = useUserControllerSelfUpdateUserMutation()
  const { control, handleSubmit, reset, formState: { errors }  } = useForm({
    defaultValues: {
      name: '',
      bio: ''
    },
    resolver: yupResolver(getProfileSettingSchema(t))
  })

  useAuthRedirect()

  useEffect(() => {
    reset({
      name: userInfo?.name || '',
      bio: userInfo?.bio || ''
    })
  }, [userInfo, reset])

  const { handleSearch } = useMezonAppSearch(1, 5)

  const onSubmit = async (data: any) => {
    try {
      await selfUpdate({ selfUpdateUserRequest: { ...data } }).unwrap()
      toast.success(t('profile.settings.update_success'))
    } catch (error) {
      toast.error(t('profile.settings.update_failed'))
    }
  }

  return (
    <div className='pt-8 pb-12 w-[75%] m-auto'>
      <MtbTypography variant='h1'>{t('profile.settings.explore')}</MtbTypography>
      <div className='pt-3'>
        <SearchBar onSearch={(val, tagIds) => handleSearch(val ?? '', tagIds)} isResultPage={false}></SearchBar>
      </div>
      <Divider className='bg-border'></Divider>
      <div className='flex justify-between gap-15 max-lg:flex-col max-2xl:flex-col'>
        <div className='w-1/3 max-lg:w-full max-2xl:w-full'>
          <CardInfo userInfo={userInfo}></CardInfo>
        </div>
        <div className='flex-1'>
          <div className='flex justify-between items-center pb-10'>
            <MtbTypography variant='h2'>{t('profile.settings.title')}</MtbTypography>
          </div>
          <div>
            <Form onFinish={handleSubmit(onSubmit)}>
              <FormField label={t('profile.settings.name_label')} description={t('profile.settings.name_desc')}>
              <Controller
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <Form.Item
                      validateStatus={errors.name ? 'error' : ''}
                      help={errors.name ? errors.name.message : ''}
                    >
                      <Input 
                        {...field} 
                        placeholder={t('profile.settings.name_placeholder')}
                      />
                    </Form.Item>
                  )}
                />
              </FormField>
              <FormField label={t('profile.settings.bio_label')} description={t('profile.settings.bio_desc')}>
                <Controller
                  control={control}
                  name='bio'
                  render={({ field }) => <Input {...field} placeholder={t('profile.settings.bio_placeholder')} />}
                />
              </FormField>
              <div className='flex items-center justify-center'>
                <Button htmlType='submit' customClassName='w-[200px] mt-5' loading={isUpdating} disabled={isUpdating}>
                  {t('profile.settings.save')}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SettingPage
