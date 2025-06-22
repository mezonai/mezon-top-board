import { Controller, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Input } from 'antd'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { capitalize } from 'lodash'

const Step2ProvideID = ({ type }: { type: MezonAppType }) => {
  const { control, formState: { errors } } = useFormContext<CreateMezonAppRequest>()
  const formattedType = capitalize(type)
  return (
    <FormField label={`${formattedType} ID`} errorText={errors.mezonAppId?.message}>
      <Controller
        control={control}
        name="mezonAppId"
        render={({ field }) => (
          <Input  {...field} placeholder={`Enter your ${type} ID`} />
        )}
      />
    </FormField>
  )
}

export default Step2ProvideID
