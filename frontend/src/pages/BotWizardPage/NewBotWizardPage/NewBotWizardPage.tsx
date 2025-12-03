import { useEffect, useMemo, useState } from 'react'
import { Divider, Steps } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import Button from '@app/mtb-ui/Button'
import { FormProvider, useForm } from 'react-hook-form'
import NewBotWizardStep1 from './NewBotWizardStep1'
import NewBotWizardStep2 from './NewBotWizardStep2'
import NewBotWizardStep3 from './NewBotWizardStep3'
import NewBotWizardStep4 from './NewBotWizardStep4'
import NewBotWizardStep5 from './NewBotWizardStep5'
import NewBotWizardStep6 from './NewBotWizardStep6'
import { WizardForm, useMockWizardFormProgress } from '../MockData'

const defaultValues: WizardForm = {
    botName: '',
    description: '',
    prefix: '',
    commands: [],
    events: [],
    integrations: { 
        database: false, 
        cacheEnabled: false, 
        apiClientEnabled: false,
        webhookEnabled: false,
        loggingEnabled: false,
        analyticsEnabled: false,
    },
    envPairs: [],
}

function NewBotWizardPage() {
    const methods = useForm<WizardForm>({ defaultValues, mode: 'onChange' })
    const [current, setCurrent] = useState(0)
    const { isSubmitting, saveDraft, submit } = useMockWizardFormProgress()

    const steps = useMemo(
        () => [
            { title: 'Bot Information', content: <NewBotWizardStep1 /> },
            { title: 'Command Builder', content: <NewBotWizardStep2 /> },
            { title: 'Event Subscription', content: <NewBotWizardStep3 /> },
            { title: 'Integrations', content: <NewBotWizardStep4 /> },
            { title: 'Environment', content: <NewBotWizardStep5 /> },
            { title: 'Preview & Confirm', content: <NewBotWizardStep6 /> },
        ],
        [],
    )

    const next = async () => {
        // TODO(VALIDATION): add per-step validation
        if (current === steps.length - 1) {
            const values = methods.getValues()
            await submit(values)
            return
        }
        setCurrent((c) => Math.min(c + 1, steps.length - 1))
    }

    const prev = () => setCurrent((c) => Math.max(c - 1, 0))

    const watched = methods.watch()
    useEffect(() => {
        const t = setTimeout(() => {
            saveDraft(watched as WizardForm)
        }, 600)
        return () => clearTimeout(t)
    }, [watched, saveDraft])

    return (
        <div className='w-full'>
            <MtbTypography variant='h2'>New Bot Wizard</MtbTypography>
            <Divider className='bg-gray-100' />

            <FormProvider {...methods}>
                <div className='flex flex-col gap-6'>
                    <Steps current={current} items={steps.map((s) => ({ title: s.title }))} />
                    <div className='mt-4'>{steps[current].content}</div>
                    <div className='flex justify-end gap-3'>
                        <Button variant='outlined' onClick={prev} disabled={current === 0 || isSubmitting}>
                            Back
                        </Button>
                        <Button color='primary' onClick={next} disabled={isSubmitting}>
                            {current === steps.length - 1 ? (isSubmitting ? 'Submitting…' : 'Finish') : 'Next'}
                        </Button>
                    </div>
                </div>
            </FormProvider>
        </div>
    )
}

export default NewBotWizardPage
