import { useFormContext } from 'react-hook-form'
import { Checkbox, Divider } from 'antd'
import { WizardForm, useMockWizardEvents } from '../MockData'

export default function NewBotWizardStep3() {
    const { setValue, watch } = useFormContext<WizardForm>()
    const selected = watch('events') || []
    const { groups, isLoading, isError } = useMockWizardEvents()

    const toggle = (key: string, checked: boolean) => {
        const next = new Set(selected)
        if (checked) next.add(key)
        else next.delete(key)
        setValue('events', Array.from(next))
    }

    return (
        <div className='flex flex-col gap-6'>
            {isLoading && <div className='text-gray-500 text-sm'>Loading events…</div>}
            {isError && <div className='text-red-500 text-sm'>Failed to load events.</div>}
            {!isLoading && !isError && groups.map((group) => (
                <div key={group.category}>
                    <div className='font-semibold mb-2'>{group.category}</div>
                    <div className='grid grid-cols-1 gap-2 min-md:grid-cols-2'>
                        {group.events.map((ev) => (
                            <Checkbox
                                key={ev.key}
                                checked={selected.includes(ev.key)}
                                onChange={(e) => toggle(ev.key, e.target.checked)}
                            >
                                {ev.label}
                            </Checkbox>
                        ))}
                    </div>
                    <Divider className='bg-gray-100' />
                </div>
            ))}
        </div>
    )
}
