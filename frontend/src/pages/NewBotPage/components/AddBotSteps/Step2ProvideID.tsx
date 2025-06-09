import { useStepValidation } from '@app/hook/useStepValidation'
import { Controller, useFormContext } from 'react-hook-form'
import { AddBotFormValues } from '../../NewBotPage'
import FormField from '@app/components/FormField/FormField'
import { Button, Input } from 'antd'

const Step2ProvideID = ({ onNext }: { onNext: () => void }) => {
  const { control, formState: { errors } } = useFormContext<AddBotFormValues>()
  const { validateStep } = useStepValidation<AddBotFormValues>()

  const handleNext = async () => {
    const valid = await validateStep(['botId'])
    if (valid) {
      onNext()
    }
  }

  return (
    <>
      <FormField label="Bot or App ID" errorText={errors.botId?.message}>
        <Controller
          control={control}
          name="botId"
          render={({ field }) => (
            <Input {...field} placeholder="Enter your bot/app ID" />
          )}
        />
      </FormField>

      <div className="text-right mt-4">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </>
  )
}

export default Step2ProvideID
