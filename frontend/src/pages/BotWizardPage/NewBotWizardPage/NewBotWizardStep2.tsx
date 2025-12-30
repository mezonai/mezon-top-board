import { useFieldArray, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Input } from 'antd'
import Button from '@app/mtb-ui/Button'
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'
import { useState } from 'react'
import CommandPreviewCard from './components/CommandPreviewCard'

export default function NewBotWizardStep2() {
    const { control } = useFormContext<BotWizardRequest>()
    const { fields, append, remove } = useFieldArray({ control, name: 'commands' })

    const [command, setCommand] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [aliasesRaw, setAliasesRaw] = useState('')

    const resetBuilder = () => {
        setCommand('')
        setDescription('')
        setCategory('')
        setAliasesRaw('')
    }

    const handleAdd = () => {
        if (!command.trim()) return
        const aliases = aliasesRaw
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)

        append({
            command: command.trim(),
            description: description.trim(),
            category: category.trim() || 'General',
            aliases
        })
        resetBuilder()
    }

    return (
        <div className='flex flex-col gap-8'>

            <div className='p-5 flex flex-col'>
                <p className="text-sm mb-4">
                    Add commands for your bot.
                    Fill in the command information below and click <b>Add Command</b> to add it to the list.
                    You can add multiple commands.
                </p>

                <FormField label='Command' description='Trigger word (e.g. ping)'>
                    <Input className='placeholder:!text-primary' value={command} onChange={(e) => setCommand(e.target.value)} placeholder='ping' />
                </FormField>

                <FormField label='Description' description="Briefly describe what this command does">
                    <Input.TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        placeholder='Explain this command'
                        className='placeholder:!text-primary'
                    />
                </FormField>

                <FormField label='Category' description="Used to group commands">
                    <Input className='placeholder:!text-primary' value={category} onChange={(e) => setCategory(e.target.value)} placeholder='General' />
                </FormField>

                <FormField label='Aliases' description="Comma-separated alternative trigger words">
                    <Input
                        className='placeholder:!text-primary'
                        value={aliasesRaw}
                        onChange={(e) => setAliasesRaw(e.target.value)}
                        placeholder='p, pong'
                    />
                </FormField>

                <div className='flex justify-end items-center pt-2 gap-3'>
                    <Button variant='outlined' onClick={resetBuilder}>Clear</Button>
                    <Button color='primary' onClick={handleAdd} disabled={!command.trim()}>Add Command</Button>
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                {fields.length === 0 && <div className='text-gray-500 text-center py-4'>No commands added yet.</div>}
                {fields.map((field, idx) => (
                    <CommandPreviewCard key={field.id} index={idx} data={field} onRemove={() => remove(idx)} />
                ))}
            </div>
        </div>
    )
}
