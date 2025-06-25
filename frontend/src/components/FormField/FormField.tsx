import { ReactNode } from 'react'

interface FormFieldProps {
  label?: string
  description?: string
  children: ReactNode
  errorText?: string
  customClass?: string
}

function FormField({ label, description = '', children, errorText, customClass }: FormFieldProps) {
  return (
    <div className={`flex items-start pt-10 gap-6 ${customClass}`}>
      <div className='flex flex-col w-1/4'>
        <p className='text-[17px] sm:text-[18px] '>{label}</p>
        <p className='text-[13px] sm:text-[14px] text-gray-500'>{description}</p>
      </div>
      <div className='flex flex-col w-[calc(75%-1.5rem)]'>
        {children}
        {errorText && <p className='text-red-500 text-sm pt-2'>{errorText}</p>}
      </div>
    </div>
  )
}

export default FormField
