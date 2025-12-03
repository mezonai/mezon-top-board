import { useFormContext } from 'react-hook-form'
import { WizardForm, useMockIntegrationOptions, IntegrationKey } from '../MockData'
import IntegrationOptionCard from './components/IntegrationOptionCard'

export default function NewBotWizardStep4() {
	const { setValue, watch } = useFormContext<WizardForm>()
	const { options, isLoading, isError } = useMockIntegrationOptions()
	const integrations = watch('integrations')

	const isChecked = (key: IntegrationKey) => {
		switch (key) {
			case 'database': return integrations.database 
			case 'externalApi': return integrations.apiClientEnabled
			case 'webhook': return integrations.webhookEnabled
			case 'logging': return integrations.loggingEnabled
			case 'analytics': return integrations.analyticsEnabled
			case 'caching': return integrations.cacheEnabled
		}
	}

	const toggle = (key: IntegrationKey, checked: boolean) => {
		switch (key) {
			case 'database':
				setValue('integrations.database', checked)
				break
			case 'externalApi':
				setValue('integrations.apiClientEnabled', checked)
				break
			case 'webhook':
				setValue('integrations.webhookEnabled', checked)
				break
			case 'logging':
				setValue('integrations.loggingEnabled', checked)
				break
			case 'analytics':
				setValue('integrations.analyticsEnabled', checked)
				break
			case 'caching':
				setValue('integrations.cacheEnabled', checked)
				break
		}
	}

	return (
		<div className='flex flex-col gap-4'>
			{isLoading && <div className='text-gray-500 text-sm'>Loading integrations…</div>}
			{isError && <div className='text-red-500 text-sm'>Failed to load integrations.</div>}
			{!isLoading && !isError && (
				<div className='grid grid-cols-1 gap-4 min-md:grid-cols-2'>
					{options.map((opt) => {
						const checked = isChecked(opt.key)
						if (opt.key === 'database') {
							return (
								<IntegrationOptionCard
									key={opt.key}
									title={opt.title}
									description={opt.description}
									checked={checked}
									onChange={(checked) => toggle(opt.key, checked)}
								/>
							)
						}
						return (
							<IntegrationOptionCard
								key={opt.key}
								title={opt.title}
								description={opt.description}
								checked={checked}
								onChange={(checked) => toggle(opt.key, checked)}
							/>
						)
					})}
				</div>
			)}
		</div>
	)
}
