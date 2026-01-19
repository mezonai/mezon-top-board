import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from "react-i18next";
import FormField from '@app/components/FormField/FormField'
import { Input, Select } from 'antd'
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'
import { useBotGeneratorControllerGetLanguagesQuery } from '@app/services/api/botGenerator/botGenerator'

export default function NewBotWizardStep1() {
    const { t } = useTranslation(['bot_wizard_page']);
    const { control, formState: { errors } } = useFormContext<BotWizardRequest>()
    const { data, isLoading } = useBotGeneratorControllerGetLanguagesQuery();

    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1'>
            <div className='grid grid-cols-1'>
                <FormField label={t('new_bot_wizard.step1.bot_name_label')} errorText={errors.botName?.message} description={t('new_bot_wizard.step1.bot_name_desc')}>
                    <Controller
                        control={control}
                        name='botName'
                        rules={{ required: t('new_bot_wizard.step1.bot_name_required') }}
                        render={({ field }) => <Input {...field} placeholder={t('new_bot_wizard.step1.bot_name_placeholder')} className='placeholder:!text-primary' />}
                    />
                </FormField>

                <FormField label={t('new_bot_wizard.step1.language_label')} errorText={errors.language?.message} description={t('new_bot_wizard.step1.language_desc')}>
                    <Controller
                        control={control}
                        name='language'
                        rules={{ required: t('new_bot_wizard.step1.language_required') }}
                        render={({ field }) => (
                            <Select {...field} 
                              className="bg-container text-primary custom-select"
                              classNames={{ popup: { root: 'custom-select-dropdown' } }}
                              styles={{ popup: { root: { background: 'var(--bg-container)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' } } }}
                              options={data?.map(lang => ({ label: lang.charAt(0).toUpperCase() + lang.slice(1), value: lang }))} 
                              placeholder={t('new_bot_wizard.step1.language_placeholder')} 
                              loading={isLoading} 
                            />
                        )}
                    />
                </FormField>
            </div>
            </div>
        </div>
    )
}
