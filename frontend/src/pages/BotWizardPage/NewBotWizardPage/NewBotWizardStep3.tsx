import { useFormContext } from 'react-hook-form'
import { useTranslation } from "react-i18next";
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'
import { useBotGeneratorControllerGetIntegrationsQuery } from '@app/services/api/botGenerator/botGenerator'
import { Checkbox, Card, Spin } from 'antd'
import { cn } from '@app/utils/cn'

export default function NewBotWizardStep3() {
    const { t } = useTranslation(['bot_wizard_page']);
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

    if (isLoading) return <div className="flex justify-center p-10"><Spin tip={t('new_bot_wizard.step3.loading')} /></div>
    if (isError) return <div className="text-danger">{t('new_bot_wizard.step3.failed', { language })}</div>

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <p className="text-sm mb-8 col-span-2">
                {t('new_bot_wizard.step3.intro')}
            </p>
            {options.map((opt) => (
                <Card
                    key={opt}
                    hoverable
                    className={cn(
                        selectedIntegrations.includes(opt) ? 'border-blue-500 bg-blue-50' : '',
                        'border !border-border cursor-pointer'
                    )}
                    onClick={() => toggle(opt, !selectedIntegrations.includes(opt))}
                >
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={selectedIntegrations.includes(opt)}
                            onChange={(e) => toggle(opt, e.target.checked)}
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold capitalize">{opt}</span>
                            <span className="text-xs text-gray-500">{t('new_bot_wizard.step3.enable_integration', { name: opt })}</span>
                        </div>
                    </div>
                </Card>
            ))}
            {!isLoading && options.length === 0 && (
                <div className="text-gray-500 col-span-2 text-center">
                    {t('new_bot_wizard.step3.no_integrations')}
                </div>
            )}
        </div>
    )
}
