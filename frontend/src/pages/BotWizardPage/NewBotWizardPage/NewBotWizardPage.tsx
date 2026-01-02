import { useMemo, useState } from 'react'
import { Steps, message } from 'antd'
import { useTranslation } from "react-i18next";
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import Button from '@app/mtb-ui/Button'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import NewBotWizardStep1 from './NewBotWizardStep1'
import NewBotWizardStep2 from './NewBotWizardStep2'
import NewBotWizardStep3 from './NewBotWizardStep3'
import NewBotWizardStep4 from './NewBotWizardStep4'
import NewBotWizardStep5 from './NewBotWizardStep5'
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'
import { useBotGeneratorControllerGenerateBotTemplateMutation } from '@app/services/api/botGenerator/botGenerator'

const defaultValues: BotWizardRequest = {
    botName: '',
    language: 'nestjs',
    commands: [],
    integrations: [],
    events: [],
    templateJson: '',
}

function NewBotWizardPage() {
    const { t } = useTranslation(['bot_wizard_page']);
    const methods = useForm<BotWizardRequest>({ defaultValues, mode: 'onChange' })
    const [current, setCurrent] = useState(0)
    const navigate = useNavigate()
    
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [generateBot, { isLoading: isSubmitting }] = useBotGeneratorControllerGenerateBotTemplateMutation()

    const steps = useMemo(
        () => [
            { title: t('new_bot_wizard.steps.bot_info'), content: <NewBotWizardStep1 /> },
            { title: t('new_bot_wizard.steps.commands'), content: <NewBotWizardStep2 /> },
            { title: t('new_bot_wizard.steps.integrations'), content: <NewBotWizardStep3 /> },
            { title: t('new_bot_wizard.steps.events'), content: <NewBotWizardStep4 /> },
            { title: t('new_bot_wizard.steps.preview'), content: <NewBotWizardStep5 /> },
        ],
        [t],
    )

    const next = async () => {
        const isValid = await methods.trigger()
        if (!isValid) return

        if (current === steps.length - 1) {
            const values = methods.getValues()
            try {
                await generateBot(values).unwrap()
                message.success(t('new_bot_wizard.messages.success'))
                setIsRedirecting(true)
                setTimeout(() => {
                    navigate('/bot-wizard')
                }, 1000) 
            } catch (error) {
                message.error(t('new_bot_wizard.messages.failure'))
                setIsRedirecting(false) 
            }
            return
        }
        setCurrent((c) => Math.min(c + 1, steps.length - 1))
    }

    const prev = () => setCurrent((c) => Math.max(c - 1, 0))

    const isLoadingState = isSubmitting || isRedirecting

    return (
        <div className='w-full text-body'>
            <MtbTypography variant='h2'>{t('new_bot_wizard.title')}</MtbTypography>   
            <div className='divider-horizontal' />

            <FormProvider {...methods}>
                <div className='flex flex-col gap-6 max-w-4xl mx-auto'>
                    <Steps 
                      current={current} 
                      items={steps.map((s) => ({ title: s.title }))} 
                      className="custom-steps"
                    />
                    
                    <div className='mt-4 min-h-[200px]'>
                        {steps[current].content}
                    </div>
                    
                    <div className='flex justify-end gap-3 mt-8 pb-10'>
                        {current > 0 && ( 
                            <Button 
                                variant='outlined' 
                                onClick={prev}
                            >
                                {t('new_bot_wizard.navigation.back')}
                            </Button>
                        )}
                        <Button 
                            color='primary' 
                            onClick={next} 
                            disabled={isLoadingState} 
                            loading={isLoadingState}
                        >
                            {current === steps.length - 1 
                                ? (isRedirecting ? t('new_bot_wizard.navigation.redirecting') : t('new_bot_wizard.navigation.finish')) 
                                : t('new_bot_wizard.navigation.next')}
                        </Button>
                    </div>
                </div>
            </FormProvider>
        </div>
    )
}

export default NewBotWizardPage