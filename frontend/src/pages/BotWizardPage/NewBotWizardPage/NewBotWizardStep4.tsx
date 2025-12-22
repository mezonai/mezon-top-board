import { useFormContext } from 'react-hook-form'
import { Checkbox } from 'antd'
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'
import { NESTJS_EVENTS } from '@app/constants/botWizard.constant'

export default function NewBotWizardStep4() {
    const { setValue, watch } = useFormContext<BotWizardRequest>()
    const selected = watch('events') || []

    const toggle = (key: string, checked: boolean) => {
        let current = [...selected]
        
        if (checked) {
            const event = NESTJS_EVENTS.find(e => e.value === key)

            current.push({
                eventName: key,
                eventType: event?.eventType,
            })
        } else {
            current = current.filter((e) => e.eventName !== key)
        }
        
        setValue('events', current, { shouldValidate: true, shouldDirty: true })
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allEvents = NESTJS_EVENTS.map(e => ({ eventName: e.value, eventType: e.eventType }))
            setValue('events', allEvents, { shouldValidate: true })
        } else {
            setValue('events', [], { shouldValidate: true })
        }
    }

    const isSelected = (key: string) => selected.some((e) => e.eventName === key)

    const isAllSelected = selected.length === NESTJS_EVENTS.length && NESTJS_EVENTS.length > 0
    const isIndeterminate = selected.length > 0 && selected.length < NESTJS_EVENTS.length

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex justify-between items-center">
                <span className="font-semibold">Available Gateway Events</span>
                <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                >
                    Select All
                </Checkbox>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4 border border-border p-4 rounded-lg bg-container mt-8'>
                {NESTJS_EVENTS.map((ev) => (
                    <Checkbox
                        key={ev.value}
                        checked={isSelected(ev.value)}
                        onChange={(e) => toggle(ev.value, e.target.checked)}
                    >
                        {ev.label}
                    </Checkbox>
                ))}
            </div>
        </div>
    )
}
