import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import FormField from '@app/components/FormField/FormField'
import { Input } from 'antd'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { capitalize } from 'lodash'

const Step2ProvideID = ({ type }: { type: MezonAppType }) => {
  const { t } = useTranslation()
  const { control, formState: { errors } } = useFormContext<CreateMezonAppRequest>()
  const formattedType = capitalize(type)
  return (
    <FormField label={t('new_bot_page.step2.label_id', { type: formattedType })} required errorText={errors.mezonAppId?.message}>
      <Controller
        control={control}
        name="mezonAppId"
        render={({ field }) => (
          <Input  
            {...field} 
            placeholder={t('new_bot_page.step2.enter_id', { type })}
            className='!bg-container !text-primary !border-border dark:!border-border placeholder:!text-primary'
          />
        )}
      />
    </FormField>
  )
}

export default Step2ProvideID
