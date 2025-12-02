import { useCallback, useEffect, useState } from 'react'
import { HttpStatus } from '@app/enums/http.enum'
import { HttpResponse } from '@app/types/API.types'

export enum WizardStatus {
  Processing = 'PROCESSING',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
}

export type WizardIntegrations = {
  database: 'none' | 'postgres';
  cache: boolean;
  apiClient: boolean;
}

export type BotWizardResponse = {
  id: string;
  name: string;
  description: string;
  prefix: string;
  commandsCount: number;
  eventsCount: number;
  integrations: WizardIntegrations;
  envPairs: number;
  status: WizardStatus;
  createdAt: string; 
}

export const mockWizardResponses: BotWizardResponse[] = [
  {
    id: 'wiz_01',
    name: 'Sales Assistant Bot',
    description: 'Automates order status and FAQs for e-commerce.',
    prefix: '!sales',
    commandsCount: 6,
    eventsCount: 4,
    integrations: { database: 'postgres', cache: true, apiClient: true },
    envPairs: 5,
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'wiz_02',
    name: 'Support Helper',
    description: 'Routes tickets and summarizes user reports.',
    prefix: '!help',
    commandsCount: 4,
    eventsCount: 7,
    integrations: { database: 'none', cache: false, apiClient: true },
    envPairs: 3,
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'wiz_03',
    name: 'Marketing Campaign Bot',
    description: 'Schedules posts and tracks campaign metrics.',
    prefix: '!market',
    commandsCount: 8,
    eventsCount: 5,
    integrations: { database: 'postgres', cache: true, apiClient: true },
    envPairs: 8,
    status: WizardStatus.Completed,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'wiz_04',
    name: 'Internal Tools Bot',
    description: 'Provides commands for deployment and CI checks.',
    prefix: '!tools',
    commandsCount: 10,
    eventsCount: 2,
    integrations: { database: 'none', cache: false, apiClient: false },
    envPairs: 2,
    status: WizardStatus.Expired,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'wiz_05',
    name: 'Inventory Tracker',
    description: 'Monitors stock levels and sends low-inventory alerts.',
    prefix: '!inv',
    commandsCount: 5,
    eventsCount: 3,
    integrations: { database: 'postgres', cache: false, apiClient: true },
    envPairs: 4,
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'wiz_06',
    name: 'Notification Dispatcher',
    description: 'Sends scheduled and triggered notifications across channels.',
    prefix: '!notify',
    commandsCount: 7,
    eventsCount: 6,
    integrations: { database: 'none', cache: true, apiClient: true },
    envPairs: 3,
    status: WizardStatus.Completed,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: 'wiz_07',
    name: 'Analytics Cruncher',
    description: 'Aggregates logs and generates analytical summaries.',
    prefix: '!ana',
    commandsCount: 9,
    eventsCount: 4,
    integrations: { database: 'postgres', cache: true, apiClient: false },
    envPairs: 7,
    status: WizardStatus.Processing,
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: 'wiz_08',
    name: 'Content Moderator Bot',
    description: 'Flags inappropriate messages and enforces moderation rules.',
    prefix: '!mod',
    commandsCount: 6,
    eventsCount: 9,
    integrations: { database: 'none', cache: true, apiClient: false },
    envPairs: 2,
    status: WizardStatus.Expired,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'wiz_09',
    name: 'Finance Reconciler',
    description: 'Matches transactions and detects inconsistencies.',
    prefix: '!fin',
    commandsCount: 8,
    eventsCount: 3,
    integrations: { database: 'postgres', cache: false, apiClient: true },
    envPairs: 6,
    status: WizardStatus.Completed,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'wiz_10',
    name: 'User Engagement Bot',
    description: 'Tracks user behavior and recommends engagement strategies.',
    prefix: '!eng',
    commandsCount: 5,
    eventsCount: 6,
    integrations: { database: 'none', cache: false, apiClient: true },
    envPairs: 3,
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

export function searchExpiredWizardRequests(
  page: number,
  pageSize: number,
): HttpResponse<BotWizardResponse[]> {
  const filtered = mockWizardResponses.filter((i) => i.status === WizardStatus.Expired)

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

export async function mockGetExpiredRequests(
  params: ExpiredRequestsParams,
): Promise<HttpResponse<BotWizardResponse[]>> {
  await simulateDelay(200)
  const { page, pageSize } = params
  return searchExpiredWizardRequests(page, pageSize)
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

export function useMockBotWizardExpiredRequests(params: ExpiredRequestsParams) {
  const { page, pageSize } = params
  const [state, setState] = useState<HookState<BotWizardResponse>>(initialState)

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, isFetching: true, isError: false }))
    try {
      await new Promise((r) => setTimeout(r, 500))
      const res = searchExpiredWizardRequests(page, pageSize)
      setState({
        data: res,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        isError: false,
      })
    } catch (err) {
      setState((s) => ({ ...s, isLoading: false, isFetching: false, isError: true, error: err }))
    }
  }, [page, pageSize])

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
