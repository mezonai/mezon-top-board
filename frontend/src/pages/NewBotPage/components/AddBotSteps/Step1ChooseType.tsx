import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import FormField from '@app/components/FormField/FormField'
import { Select } from 'antd'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { MezonAppType } from '@app/enums/mezonAppType.enum'

const Step1ChooseType = () => {
  const { t } = useTranslation(['new_bot_page', 'validation'])
  const { control, formState: { errors } } = useFormContext<CreateMezonAppRequest>()

  return (
    <FormField label={t('new_bot_page.step1.select_type')} errorText={errors.type?.message}>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select
            {...field}
            placeholder={t('new_bot_page.step1.placeholder')}
            className="w-full bg-container text-primary"
            popupClassName="custom-select-dropdown"
            dropdownStyle={{ background: 'var(--bg-container)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            options={[
              { label: t('new_bot_page.step1.bot'), value: MezonAppType.BOT },
              { label: t('new_bot_page.step1.app'), value: MezonAppType.APP },
            ]}
          />
        )}
      />
    </FormField>
  )
}

export default Step1ChooseType;
