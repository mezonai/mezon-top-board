import { useStepValidation } from '@app/hook/useStepValidation'
import { Controller, useFormContext } from 'react-hook-form'
import { AddBotFormValues } from '../../NewBotPage'
import FormField from '@app/components/FormField/FormField'
import { Button, Select } from 'antd'

export const Step1ChooseType = ({ onNext }: { onNext: () => void }) => {
  const { control, formState: { errors } } = useFormContext<AddBotFormValues>()
  const { validateStep } = useStepValidation<AddBotFormValues>()

  const handleNext = async () => {
    const valid = await validateStep(['type']) // chỉ validate trường 'type'
    if (valid) {
      onNext()
    }
  }

  return (
    <>
      <FormField label="Select Type" errorText={errors.type?.message}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Choose Bot or App"
              options={[
                { label: 'Bot', value: 'bot' },
                { label: 'App', value: 'app' }
              ]}
            />
          )}
        />
      </FormField>

      <div className="text-right mt-4">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </>
  )
}
