import { Controller, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Input } from 'antd'
import { WizardForm } from '../MockData'

export default function NewBotWizardStep1() {
    const { control, formState: { errors } } = useFormContext<WizardForm>()

    return (
        <div className='flex flex-col gap-4'>
            <FormField label='Bot Name' errorText={errors.botName?.message} description='Name your bot'>
                <Controller
                    control={control}
                    name='botName'
                    rules={{ required: 'Bot name is required' }}
                    render={({ field }) => <Input {...field} placeholder='MezonBot' />}
                />
            </FormField>

            <FormField label='Description' errorText={errors.description?.message} description='Short description'>
                <Controller
                    control={control}
                    name='description'
                    render={({ field }) => <Input.TextArea {...field} rows={4} placeholder='What does your bot do?' />}
                />
            </FormField>

            <FormField label='Prefix' errorText={errors.prefix?.message} description='Command prefix'>
                <Controller
                    control={control}
                    name='prefix'
                    rules={{ required: 'Prefix is required' }}
                    render={({ field }) => <Input {...field} placeholder='!bot' />}
                />
            </FormField>
        </div>
    )
}
