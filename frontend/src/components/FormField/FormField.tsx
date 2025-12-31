import { ReactNode } from 'react'
import { cn } from '@app/utils/cn'
import { useTranslation } from 'react-i18next'

interface FormFieldProps {
  label?: string
  required?: boolean
  description?: string
  children: ReactNode
  errorText?: string
  customClass?: string
}

function FormField({ label, required = false, description = '', children, errorText, customClass }: FormFieldProps) {
  const { t } = useTranslation(['validation', 'common'])
  return (
    <div className={cn('flex items-start pt-10 gap-6', customClass)}>
      <div className='flex flex-col w-1/4'>
        <p className='text-md sm:text-sm text-primary font-medium'>
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </p>
           <p className='text-xs sm:text-md text-secondary mt-1'>{description}</p>
      </div>
      <div className='flex flex-col w-[calc(75%-1.5rem)]'>
        {children}
        {errorText && <p className="text-xs sm:text-sm pt-2 text-danger">{t(errorText)}</p>}
      </div>
    </div>
  )
}

export default FormField
