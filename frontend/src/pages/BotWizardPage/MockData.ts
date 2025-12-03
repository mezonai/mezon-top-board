import { useCallback, useEffect, useState } from 'react'
import { HttpStatus } from '@app/enums/http.enum'
import { HttpResponse } from '@app/types/API.types'

export enum WizardStatus {
  Processing = 'PROCESSING',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
}

export type IntegrationsState = {
  database: boolean;
  cacheEnabled: boolean;
  apiClientEnabled: boolean;
  webhookEnabled: boolean;
  loggingEnabled: boolean;
  analyticsEnabled: boolean;
}

export type WizardCommand = {
  id?: string
  name: string
  description?: string
  usage: string
  category: string
  aliases?: string[]
}

export type WizardEvent = { 
  category: string; 
  events: { 
    key: string; 
    label: string 
  }[] 
}

export type WizardENVPair = {
  key: string;
  value: string;
}

export const mockWizardEvents: WizardEvent[] = [
  {
    category: 'Message', events: [
      { key: 'message.received', label: 'Message Received' },
      { key: 'message.edited', label: 'Message Edited' },
    ]
  },
  {
    category: 'User', events: [
      { key: 'user.joined', label: 'User Joined' },
      { key: 'user.left', label: 'User Left' },
    ]
  },
]

export type BotWizardResponse = {
  id: string;
  name: string;
  description: string;
  prefix: string;
  commands: WizardCommand[];
  events: string[];
  integrations: IntegrationsState;
  envPairs: WizardENVPair[];
  status: WizardStatus;
  createdAt: string;
  fileName?: string;
}

// Helpers to generate mock arrays
const flattenEventKeys = () => mockWizardEvents.flatMap((g) => g.events.map((e) => e.key))
const genCommands = (baseId: string, prefix: string, count: number): WizardCommand[] =>
  Array.from({ length: count }, (_, i) => {
    const idx = i + 1
    const name = `cmd${idx}`
    return {
      id: `${baseId}_cmd_${idx}`,
      name,
      usage: `${prefix}${name} [args]`,
      category: idx % 2 === 0 ? 'admin' : 'general',
      aliases: idx % 3 === 0 ? [`${name}Alt`] : [],
      description: 'Mock command generated for preview.',
    }
  })

const genEvents = (count: number): string[] => flattenEventKeys().slice(0, count)
const genEnvPairs = (count: number) => Array.from({ length: count }, (_, i) => ({ key: `KEY_${i + 1}`, value: `value_${i + 1}` }))

export const mockWizardResponses: BotWizardResponse[] = [
  {
    id: 'wiz_01',
    name: 'Sales Assistant Bot',
    description: 'Automates order status and FAQs for e-commerce.',
    prefix: '!sales',
    commands: genCommands('wiz_01', '!sales', 6),
    events: genEvents(4),
    integrations: { database: true, cacheEnabled: true, apiClientEnabled: true, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(5),
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'wiz_02',
    name: 'Support Helper',
    description: 'Routes tickets and summarizes user reports.',
    prefix: '!help',
    commands: genCommands('wiz_02', '!help', 4),
    events: genEvents(7),
    integrations: { database: false, cacheEnabled: false, apiClientEnabled: true, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(3),
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'wiz_03',
    name: 'Marketing Campaign Bot',
    description: 'Schedules posts and tracks campaign metrics.',
    prefix: '!market',
    commands: genCommands('wiz_03', '!market', 8),
    events: genEvents(5),
    integrations: { database: true, cacheEnabled: true, apiClientEnabled: true, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(8),
    status: WizardStatus.Completed,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'wiz_04',
    name: 'Internal Tools Bot',
    description: 'Provides commands for deployment and CI checks.',
    prefix: '!tools',
    commands: genCommands('wiz_04', '!tools', 10),
    events: genEvents(2),
    integrations: { database: false, cacheEnabled: false, apiClientEnabled: false, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(2),
    status: WizardStatus.Expired,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'wiz_05',
    name: 'Inventory Tracker',
    description: 'Monitors stock levels and sends low-inventory alerts.',
    prefix: '!inv',
    commands: genCommands('wiz_05', '!inv', 5),
    events: genEvents(3),
    integrations: { database: true, cacheEnabled: false, apiClientEnabled: true, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(4),
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'wiz_06',
    name: 'Notification Dispatcher',
    description: 'Sends scheduled and triggered notifications across channels.',
    prefix: '!notify',
    commands: genCommands('wiz_06', '!notify', 7),
    events: genEvents(6),
    integrations: { database: false, cacheEnabled: true, apiClientEnabled: true, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(3),
    status: WizardStatus.Completed,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: 'wiz_07',
    name: 'Analytics Cruncher',
    description: 'Aggregates logs and generates analytical summaries.',
    prefix: '!ana',
    commands: genCommands('wiz_07', '!ana', 9),
    events: genEvents(4),
    integrations: { database: true, cacheEnabled: true, apiClientEnabled: false, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(7),
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: 'wiz_08',
    name: 'Content Moderator Bot',
    description: 'Flags inappropriate messages and enforces moderation rules.',
    prefix: '!mod',
    commands: genCommands('wiz_08', '!mod', 6),
    events: genEvents(9),
    integrations: { database: false, cacheEnabled: true, apiClientEnabled: false, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(2),
    status: WizardStatus.Expired,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'wiz_09',
    name: 'Finance Reconciler',
    description: 'Matches transactions and detects inconsistencies.',
    prefix: '!fin',
    commands: genCommands('wiz_09', '!fin', 8),
    events: genEvents(3),
    integrations: { database: true, cacheEnabled: false, apiClientEnabled: true, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(6),
    status: WizardStatus.Completed,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'wiz_10',
    name: 'User Engagement Bot',
    description: 'Tracks user behavior and recommends engagement strategies.',
    prefix: '!eng',
    commands: genCommands('wiz_10', '!eng', 5),
    events: genEvents(6),
    integrations: { database: false, cacheEnabled: false, apiClientEnabled: true, webhookEnabled: false, loggingEnabled: false, analyticsEnabled: false },
    envPairs: genEnvPairs(3),
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

export function searchRecentWizardRequests(
  status: 'all' | WizardStatus,
  page: number,
  pageSize: number,
  recentHours: number = 24,
): HttpResponse<BotWizardResponse[]> {
  const now = Date.now()
  const withinMs = recentHours * 60 * 60 * 1000
  const recent = mockWizardResponses.filter((i) => {
    const ts = new Date(i.createdAt).getTime()
    return now - ts <= withinMs
  })

  const filtered = status === 'all' ? recent : recent.filter((i) => i.status === status)

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filtered.slice(start, end)

  return {
    data,
    statusCode: HttpStatus.OK,
    totalCount,
    totalPages,
    pageNumber: page,
    pageSize,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  }
}

export type RecentRequestsParams = {
  status: 'all' | WizardStatus
  page: number
  pageSize: number
  recentHours?: number
}

export type ExpiredRequestsParams = {
  page: number
  pageSize: number
}

const simulateDelay = (ms = 200) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function mockGetRecentRequests(
  params: RecentRequestsParams,
): Promise<HttpResponse<BotWizardResponse[]>> {
  await simulateDelay(200)
  const { status, page, pageSize, recentHours = 24 } = params
  return searchRecentWizardRequests(status, page, pageSize, recentHours)
}

type HookState<T> = {
  data?: HttpResponse<T[]>
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  error?: unknown
}

const initialState = {
  data: undefined,
  isLoading: true,
  isFetching: true,
  isSuccess: false,
  isError: false,
}

export function useMockBotWizardRecentRequests(params: RecentRequestsParams) {
  const { status, page, pageSize, recentHours = 24 } = params

  const [state, setState] = useState<HookState<BotWizardResponse>>(initialState)

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, isFetching: true, isError: false }))

    try {
      await new Promise((r) => setTimeout(r, 500))

      const res = searchRecentWizardRequests(status, page, pageSize, recentHours)

      setState({
        data: res,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        isError: false,
        error: undefined
      })
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: true,
        error: err
      }))
    }
  }, [status, page, pageSize, recentHours])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data: state.data,
    isLoading: state.isLoading,
    isFetching: state.isFetching,
    isSuccess: state.isSuccess,
    isError: state.isError,
    error: state.error,
    refetch: fetchData,
  }
}

export type WizardForm = {
  botName: string
  description: string
  prefix: string
  commands: WizardCommand[]
  events: string[]
  integrations: IntegrationsState
  envPairs: WizardENVPair[]
}

export function useMockWizardFormProgress() {
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>()
  const [error, setError] = useState<unknown>()

  const saveDraft = useCallback(async (_form: WizardForm) => {
    try {
      setIsSavingDraft(true)
      setError(undefined)
      await simulateDelay(300)
      setLastSavedAt(new Date().toISOString())
    } catch (e) {
      setError(e)
    } finally {
      setIsSavingDraft(false)
    }
  }, [])

  const submit = useCallback(async (_form: WizardForm) => {
    try {
      setIsSubmitting(true)
      setError(undefined)
      await simulateDelay(600)
      return { id: `wiz_${Math.random().toString(36).slice(2, 8)}` }
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { isSavingDraft, isSubmitting, lastSavedAt, error, saveDraft, submit }
}

export type CommonSelectOption = { label: string; value: string }

const mockCommandCategories: CommonSelectOption[] = [
  { label: 'General', value: 'general' },
  { label: 'Admin', value: 'admin' },
  { label: 'Utility', value: 'utility' },
]

export function useMockCommandCategories() {
  const [options, setOptions] = useState<CommonSelectOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      await simulateDelay(250)
      setOptions(mockCommandCategories)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { options, isLoading, isError, refetch: load }
}

export function useMockWizardEvents() {
  const [groups, setGroups] = useState<WizardEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      await simulateDelay(300)
      setGroups(mockWizardEvents)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { groups, isLoading, isError, refetch: load }
}


export type IntegrationKey = 'database' | 'externalApi' | 'webhook' | 'logging' | 'analytics' | 'caching'
export type IntegrationOption = { key: IntegrationKey; title: string; description: string }

const mockIntegrationOptions: IntegrationOption[] = [
  { key: 'database', title: 'Database', description: 'Persist application data' },
  { key: 'externalApi', title: 'External API', description: 'Call third-party services' },
  { key: 'webhook', title: 'Webhook', description: 'Receive events from external systems' },
  { key: 'logging', title: 'Logging', description: 'Record application activities' },
  { key: 'analytics', title: 'Analytics', description: 'Analyze usage and metrics' },
  { key: 'caching', title: 'Caching', description: 'Cache frequently accessed data' },
]

export function useMockIntegrationOptions() {
  const [options, setOptions] = useState<IntegrationOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      await simulateDelay(300)
      setOptions(mockIntegrationOptions)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { options, isLoading, isError, refetch: load }
}

export type BotWizardDetail = {
  id: string
  name: string
  description: string
  prefix: string
  commands: WizardCommand[]
  events: string[]
  integrations: IntegrationsState
  envPairs: Array<{ key: string; value: string }>
  createdAt: string
}

