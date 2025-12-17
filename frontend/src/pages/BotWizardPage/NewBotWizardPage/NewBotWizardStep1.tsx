import { Controller, useFormContext } from 'react-hook-form'
import FormField from '@app/components/FormField/FormField'
import { Input, Select } from 'antd'
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'
import { useBotGeneratorControllerGetLanguagesQuery } from '@app/services/api/botGenerator/botGenerator'

export default function NewBotWizardStep1() {
    const { control, formState: { errors } } = useFormContext<BotWizardRequest>()
    const { data, isLoading } = useBotGeneratorControllerGetLanguagesQuery();

    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1'>
                <FormField label='Bot Name' errorText={errors.botName?.message} description='Name your bot'>
                    <Controller
                        control={control}
                        name='botName'
                        rules={{ required: 'Bot name is required' }}
                        render={({ field }) => <Input {...field} placeholder='MezonBot' />}
                    />
                </FormField>

                <FormField label='Language' errorText={errors.language?.message} description='Framework language'>
                    <Controller
                        control={control}
                        name='language'
                        rules={{ required: 'Language is required' }}
                        render={({ field }) => (
                            <Select {...field} options={data?.map(lang => ({ label: lang.charAt(0).toUpperCase() + lang.slice(1), value: lang }))} placeholder="Select language" loading={isLoading} />
                        )}
                    />
                </FormField>
            </div>
        </div>
    )
}
