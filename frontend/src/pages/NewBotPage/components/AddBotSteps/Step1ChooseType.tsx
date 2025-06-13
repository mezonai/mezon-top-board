import { useStepValidation } from '@app/hook/useStepValidation'
import { Controller, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Button, Select } from 'antd'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp'
import { MezonAppType } from '@app/enums/mezonAppType.enum'

export const Step1ChooseType = ({ onNext }: { onNext: () => void }) => {
  const { control, formState: { errors } } = useFormContext<CreateMezonAppRequest>()
  const { validateStep } = useStepValidation<CreateMezonAppRequest>()

  const handleNext = async () => {
    const valid = await validateStep(['type']) // chỉ validate trường 'type'
    if (valid) {
      onNext()
    }
  }

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
