import { AppLanguage } from '@app/enums/appLanguage.enum'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import { useTranslation } from 'react-i18next'

interface LanguageSelectorProps {
  value: AppLanguage
  onChange: (value: AppLanguage) => void
  defaultLanguage?: string
  className?: string
}

const LanguageSelector = ({ value, onChange, defaultLanguage, className }: LanguageSelectorProps) => {
  const { t } = useTranslation(['common'])
  
  const langOptions: IOption[] = [
    {
      value: AppLanguage.EN,
      label: (
        <span>
          English{' '}
          {defaultLanguage === AppLanguage.EN && (
            <span className="text-xs opacity-80">({t('multilingual.default')})</span>
          )}
        </span>
      )
    },
    {
      value: AppLanguage.VI,
      label: (
        <span>
          Tiếng Việt{' '}
          {defaultLanguage === AppLanguage.VI && (
            <span className="text-xs opacity-80">({t('multilingual.default')})</span>
          )}
        </span>
      )
    }
  ]

  return (
    <SingleSelect
      getPopupContainer={(trigger) => trigger.parentElement}
      options={langOptions}
      value={langOptions.find((o) => o.value === value)}
      onChange={(option) => onChange(option.value as AppLanguage)}
      placeholder="Language"
      size="middle"
      className={`w-[11rem] text-primary ${className || ''}`}
    />
  )
}

export default LanguageSelector