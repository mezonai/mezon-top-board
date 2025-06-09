import { useFormContext } from 'react-hook-form'

import type { FieldValues } from 'react-hook-form'

export const useStepValidation = <TFieldValues extends FieldValues = FieldValues>() => {
  const { trigger } = useFormContext<TFieldValues>()

  const validateStep = async (fields: (keyof TFieldValues)[]): Promise<boolean> => {
    const result = await trigger(fields as unknown as import('react-hook-form').Path<TFieldValues>[])
    return result
  }

  return { validateStep }
}
