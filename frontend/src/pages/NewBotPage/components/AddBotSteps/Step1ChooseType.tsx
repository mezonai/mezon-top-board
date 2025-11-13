import { Controller, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Select } from 'antd'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { MezonAppType } from '@app/enums/mezonAppType.enum'

const Step1ChooseType = () => {
  const { control, formState: { errors } } = useFormContext<CreateMezonAppRequest>()

  return (
    <FormField label="Select Type" errorText={errors.type?.message}>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Choose Bot or App"
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
