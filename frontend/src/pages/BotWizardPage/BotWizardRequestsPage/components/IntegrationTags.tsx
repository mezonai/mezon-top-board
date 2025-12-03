import { Tag, Tooltip } from 'antd'
import type { BotWizardResponse } from '../../MockData'

export const integrationMeta = {
    database: { label: 'DB', tooltip: 'PostgreSQL database enabled', color: 'blue' },
    cacheEnabled: { label: 'Redis', tooltip: 'Caching enabled', color: 'cyan' },
    apiClientEnabled: { label: 'HTTP', tooltip: 'HTTP client enabled', color: 'purple' },
    webhookEnabled: { label: 'Webhook', tooltip: 'Webhook integration enabled', color: 'gold' },
    loggingEnabled: { label: 'Logging', tooltip: 'Logging enabled', color: 'geekblue' },
    analyticsEnabled: { label: 'Analytics', tooltip: 'Analytics enabled', color: 'volcano' },
} as const

type Props = {
    integrations: BotWizardResponse['integrations']
    className?: string
    emptyText?: string
}

export default function IntegrationTags({ integrations, className = '', emptyText = 'None' }: Props) {
    const enabledKeys = Object.entries(integrations || {})
        .filter(([k, v]) => Boolean(v) && k in integrationMeta)
        .map(([k]) => k as keyof typeof integrationMeta)

    if (enabledKeys.length === 0) return <span className={`font-medium ${className}`}>{emptyText}</span>

    return (
        <span className={`inline-flex flex-wrap gap-2 align-middle ${className}`}>
            {enabledKeys.map((key) => {
                const meta = integrationMeta[key]
                return (
                    <Tooltip key={key} title={meta.tooltip}>
                        <Tag color={meta.color}>{meta.label}</Tag>
                    </Tooltip>
                )
            })}
        </span>
    )
}
