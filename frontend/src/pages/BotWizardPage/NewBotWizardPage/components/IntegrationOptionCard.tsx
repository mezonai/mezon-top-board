import { Checkbox, Skeleton } from 'antd'
import { ReactNode } from 'react'

type Props = {
    title: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    loading?: boolean
    children?: ReactNode
}

export default function IntegrationOptionCard({ title, description, checked, onChange, disabled, loading, children }: Props) {
    const isDisabled = disabled || loading
    return (
        <label className='cursor-pointer p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex items-start gap-3'>
            <Checkbox
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={isDisabled}
            />
            <div className='flex-1'>
                {loading ? (
                    <div className='flex flex-col gap-2'>
                        <Skeleton.Input active size='small' style={{ width: 160 }} />
                        <Skeleton.Input active size='small' style={{ width: 220 }} />
                    </div>
                ) : (
                    <>
                        <div className='font-semibold'>{title}</div>
                        <div className='text-xs text-gray-500'>{description}</div>
                        {children ? (
                            <div className='mt-3'>
                                {children}
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </label>
    )
}
