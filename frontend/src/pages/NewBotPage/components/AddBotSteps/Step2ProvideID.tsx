import { useStepValidation } from '@app/hook/useStepValidation'
import { Controller, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Button, Input } from 'antd'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp'

const Step2ProvideID = ({ onNext }: { onNext: () => void }) => {
  const { control, formState: { errors } } = useFormContext<CreateMezonAppRequest>()
  const { validateStep } = useStepValidation<CreateMezonAppRequest>()

  const handleNext = async () => {
    const valid = await validateStep(['id'])
    if (valid) {
      onNext()
    }
  }

  return (
    <FormField label="Bot or App ID" errorText={errors.id?.message}>
      <Controller
        control={control}
        name="id"
        render={({ field }) => (
          <Input {...field} placeholder="Enter your bot/app ID" />
        )}
      />
    </FormField>
  )
}

export default Step2ProvideID
