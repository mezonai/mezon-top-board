import { useFormContext } from 'react-hook-form'
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'
import { useBotGeneratorControllerGetIntegrationsQuery } from '@app/services/api/botGenerator/botGenerator'
import { Checkbox, Card, Spin } from 'antd'

export default function NewBotWizardStep3() {
    const { setValue, watch } = useFormContext<BotWizardRequest>()
    const language = watch('language') || 'nestjs'
    const selectedIntegrations = watch('integrations') || []

    const { data: options = [], isLoading, isError } = useBotGeneratorControllerGetIntegrationsQuery(
        { language },
        { skip: !language }
    )

    const toggle = (value: string, checked: boolean) => {
        const current = new Set(selectedIntegrations)
        if (checked) current.add(value)
        else current.delete(value)
        setValue('integrations', Array.from(current))
    }

    if (isLoading) return <div className="flex justify-center p-10"><Spin tip="Loading integrations..." /></div>
    if (isError) return <div className="text-red-500">Failed to load integrations for {language}.</div>

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <p className="text-sm mb-8 col-span-2 font-semibold">
                Select the integrations you want to include in your bot.
                Click on a card or checkbox to enable or disable an integration.
            </p>
            {options.map((opt) => (
                <Card
                    key={opt}
                    hoverable
                    className={`${selectedIntegrations.includes(opt) ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => toggle(opt, !selectedIntegrations.includes(opt))}
                >
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={selectedIntegrations.includes(opt)}
                            onChange={(e) => toggle(opt, e.target.checked)}
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold capitalize">{opt}</span>
                            <span className="text-xs text-gray-500">Enable {opt} integration</span>
                        </div>
                    </div>
                </Card>
            ))}
            {!isLoading && options.length === 0 && (
                <div className="text-gray-500 col-span-2 text-center">
                    No integrations available for this language.
                </div>
            )}
        </div>
    )
}