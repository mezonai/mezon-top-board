import { useFieldArray, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Input, message } from 'antd'
import MtbButton from '@app/mtb-ui/Button'
import { WizardForm } from '../MockData'
import EnvPairPreviewCard from './components/EnvPairPreviewCard'
import { useState } from 'react'

export default function NewBotWizardStep5() {
    const { control } = useFormContext<WizardForm>()
    const { fields, append, remove } = useFieldArray({ control, name: 'envPairs' })

    const [k, setK] = useState('')
    const [v, setV] = useState('')

    const addPair = () => {
        const keyTrim = k.trim()
        const valTrim = v.trim()
        if (!keyTrim || !valTrim) {
            message.warning('Key and Value are required')
            return
        }
        append({ key: keyTrim, value: valTrim })
        setK('')
        setV('')
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 min-md:grid-cols-2 gap-6 p-4 bg-white'>
                <FormField label='Key' customClass=''>
                    <Input value={k} onChange={(e) => setK(e.target.value)} placeholder='API_KEY' />
                </FormField>
                <FormField label='Value'>
                    <Input value={v} onChange={(e) => setV(e.target.value)} placeholder='secret-value' />
                </FormField>
            </div>
            <div className='min-md:col-span-1 flex min-md:justify-end'>
                <MtbButton color='primary' onClick={addPair}>Add</MtbButton>
            </div>

            {fields.length === 0 && <div className='text-gray-500'>No environment pairs yet.</div>}

            <div className='grid grid-cols-1 gap-3'>
                {fields.map((field, idx) => (
                    <EnvPairPreviewCard
                        key={field.id}
                        data={{ keyName: (field as any).key, value: (field as any).value }}
                        onRemove={() => remove(idx)}
                    />
                ))}
            </div>
        </div>
    )
}
