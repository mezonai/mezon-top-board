import { useFieldArray, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Input, Select } from 'antd'
import Button from '@app/mtb-ui/Button'
import { WizardForm, useMockCommandCategories } from '../MockData'
import { useState } from 'react'
import CommandPreviewCard from './components/CommandPreviewCard'

export default function NewBotWizardStep2() {
    const { control } = useFormContext<WizardForm>()
    const { fields, append, remove } = useFieldArray({ control, name: 'commands' })

    const [cmdName, setCmdName] = useState('')
    const [cmdDesc, setCmdDesc] = useState('')
    const [cmdUsage, setCmdUsage] = useState('')
    const [cmdCategory, setCmdCategory] = useState<string | undefined>()
    const [cmdAliasesRaw, setCmdAliasesRaw] = useState('')
    const { options: categoryOptions, isLoading: catLoading, isError: catError } = useMockCommandCategories()

    const resetBuilder = () => {
        setCmdName('')
        setCmdDesc('')
        setCmdUsage('')
        setCmdCategory(undefined)
        setCmdAliasesRaw('')
    }

    const handleAdd = () => {
        if (!cmdName.trim() || !cmdUsage.trim()) return
        const aliases = cmdAliasesRaw
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        append({ name: cmdName.trim(), description: cmdDesc.trim(), usage: cmdUsage.trim(), category: cmdCategory || '', aliases })
        resetBuilder()
    }

    return (
        <div className='flex flex-col gap-8'>
            <div className='p-5 flex flex-col gap-5 bg-white/50'>
                <FormField label='Command Name' description='Required'>
                    <Input value={cmdName} onChange={(e) => setCmdName(e.target.value)} placeholder='e.g., greet' />
                </FormField>
                <FormField label='Usage' description='Required'>
                    <Input value={cmdUsage} onChange={(e) => setCmdUsage(e.target.value)} placeholder='e.g., !greet [name]' />
                </FormField>
                <FormField label='Category'>
                    <Select
                        value={cmdCategory}
                        onChange={(v) => setCmdCategory(v)}
                        allowClear
                        loading={catLoading}
                        disabled={catLoading || catError}
                        placeholder={catLoading ? 'Loading categories…' : (catError ? 'Failed to load categories' : 'Choose category')}
                        options={categoryOptions}
                    />
                </FormField>
                <FormField label='Aliases (comma-separated)' description='Optional'>
                    <Input
                        value={cmdAliasesRaw}
                        onChange={(e) => setCmdAliasesRaw(e.target.value)}
                        placeholder='hi, hello'
                    />
                </FormField>
                <FormField label='Description'>
                    <Input.TextArea
                        value={cmdDesc}
                        onChange={(e) => setCmdDesc(e.target.value)}
                        rows={3}
                        placeholder='Explain this command'
                    />
                </FormField>
                <div className='flex justify-end items-center pt-2'>
                    <div className='flex gap-3'>
                        <Button variant='outlined' onClick={resetBuilder} disabled={!cmdName && !cmdUsage && !cmdDesc && !cmdAliasesRaw && !cmdCategory}>Clear</Button>
                        <Button color='primary' onClick={handleAdd} disabled={!cmdName.trim() || !cmdUsage.trim()}>Add Command</Button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                {fields.length === 0 && <div className='text-gray-500'>No commands added yet.</div>}
                {fields.map((field, idx) => (
                    <CommandPreviewCard key={field.id} index={idx} data={field} onRemove={() => remove(idx)} />
                ))}
            </div>
        </div>
    )
}
