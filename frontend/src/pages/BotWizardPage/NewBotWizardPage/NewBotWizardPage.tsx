import { useMemo, useState } from 'react'
import { Steps, message } from 'antd'
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
    const methods = useForm<BotWizardRequest>({ defaultValues, mode: 'onChange' })
    const [current, setCurrent] = useState(0)
    const navigate = useNavigate()
    
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [generateBot, { isLoading: isSubmitting }] = useBotGeneratorControllerGenerateBotTemplateMutation()

    const steps = useMemo(
        () => [
            { title: 'Bot Info', content: <NewBotWizardStep1 /> },
            { title: 'Commands', content: <NewBotWizardStep2 /> },
            { title: 'Integrations', content: <NewBotWizardStep3 /> },
            { title: 'Events', content: <NewBotWizardStep4 /> },
            { title: 'Preview', content: <NewBotWizardStep5 /> },
        ],
        [],
    )

    const next = async () => {
        const isValid = await methods.trigger()
        if (!isValid) return

        if (current === steps.length - 1) {
            const values = methods.getValues()
            try {
                await generateBot(values).unwrap()
                message.success('Request submitted successfully!')
                setIsRedirecting(true)
                setTimeout(() => {
                    navigate('/bot-wizard')
                }, 1000) 
            } catch (error) {
                message.error('Failed to submit request. Please try again.')
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
            <MtbTypography variant='h2'>New Bot Wizard</MtbTypography>   
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
                        <Button 
                            variant='outlined' 
                            onClick={prev} 
                            disabled={current === 0 || isLoadingState}
                        >
                            Back
                        </Button>
                        <Button 
                            color='primary' 
                            onClick={next} 
                            disabled={isLoadingState} 
                            loading={isLoadingState}
                        >
                            {current === steps.length - 1 
                                ? (isRedirecting ? 'Redirecting...' : 'Finish') 
                                : 'Next'}
                        </Button>
                    </div>
                </div>
            </FormProvider>
        </div>
    )
}

export default NewBotWizardPage