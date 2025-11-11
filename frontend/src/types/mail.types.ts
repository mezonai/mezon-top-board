import { RepeatInterval, EmailSubscriptionStatus } from '@app/enums/subscribe'

export type MailTemplate = {
    id: string
    subject: string
    content: string
    scheduledAt?: Date
    isRepeatable: boolean
    repeatInterval: RepeatInterval
    createdAt: Date
    updatedAt: Date
}

export type Subscriber = {
    id: string
    email: string
    status: EmailSubscriptionStatus
    createdAt: Date
    updatedAt: Date
}