import { Controller, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Select } from 'antd'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { MezonAppType } from '@app/enums/mezonAppType.enum'

const Step1ChooseType = () => {
  const { control, formState: { errors } } = useFormContext<CreateMezonAppRequest>()

  return (
    <FormField label="Select Type" errorText={errors.type?.message}>
      <style>
        {`
          .custom-select .ant-select-selector {
            background-color: var(--bg-container) !important;
            color: var(--text-primary) !important;
            border-color: var(--border-color) !important;
          }
          .custom-select-dropdown {
             background-color: var(--bg-container) !important;
             border: 1px solid var(--border-color) !important;
          }
          .custom-select-dropdown .ant-select-item {
             color: var(--text-primary) !important;
          }
          .custom-select-dropdown .ant-select-item-option-active,
          .custom-select-dropdown .ant-select-item-option-selected {
             background-color: var(--bg-container-secondary) !important;
             color: var(--text-primary) !important;
          }
        `}
      </style>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Choose Bot or App"
            className="w-full custom-select"
            popupClassName="custom-select-dropdown"
            options={[
              { label: 'Bot', value: MezonAppType.BOT },
              { label: 'App', value: MezonAppType.APP },
            ]}
          />
        )}
      />
    </FormField>
  )
}

export default Step1ChooseType;
