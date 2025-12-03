import type { WizardForm } from '../../MockData'

const INDENT = '  '

function line(depth: number, text: string) {
    return `${INDENT.repeat(depth)}${text}`
}

export function buildProjectTree(values: WizardForm): string[] {
    const lines: string[] = []

    lines.push(line(0, './'))
    lines.push(line(1, '.env'))
    lines.push(line(1, 'src/'))

    lines.push(line(2, 'commands/'))
    if (values.commands.length > 0) {
        for (const c of values.commands) {
            lines.push(line(3, `${c.name}.ts`))
        }
    }

    lines.push(line(2, 'events/'))
    if (values.events.length > 0) {
        for (const e of values.events) {
            lines.push(line(3, `${e.replace(/\./g, '_')}.ts`))
        }
    }

    lines.push(line(2, 'integrations/'))
    if (values.integrations.database) lines.push(line(3, 'database.ts'))
    if (values.integrations.cacheEnabled) lines.push(line(3, 'cache.ts'))
    if (values.integrations.apiClientEnabled) lines.push(line(3, 'http.ts'))
    if (values.integrations.webhookEnabled) lines.push(line(3, 'webhook.ts'))
    if (values.integrations.loggingEnabled) lines.push(line(3, 'logging.ts'))
    if (values.integrations.analyticsEnabled) lines.push(line(3, 'analytics.ts'))

    lines.push(line(2, 'bot.ts'))

    return lines
}