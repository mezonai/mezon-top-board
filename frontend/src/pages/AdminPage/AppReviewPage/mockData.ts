import { useCallback, useState, useEffect } from 'react'

export type UUID = string
export type Timestamp = string

export type AppStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED'
export type AppType = 'BOT' | 'TOOL' | 'SERVICE'
export type AppPricing = 'FREE' | 'PAID'

export interface OwnerInMezonAppDetailResponse {
    id: string
    name: string
    profileImage?: string | null
}

export interface GetMezonAppDetailsResponse {
    id: string
    name: string
    description: string
    prefix: string
    headline: string
    featuredImage: string
    status: number
    owner: OwnerInMezonAppDetailResponse
    tags?: { id: string; name: string }[]
    pricingTag?: string
    price?: number
    rateScore?: number
    type?: AppType
    mezonAppId?: string
    supportUrl?: string
    remark?: string

}

export interface App {
    id: UUID
    name: string
    ownerId: UUID
    status: AppStatus
    isAutoPublished: boolean
    type: AppType
    mezonAppId?: string
    headline?: string | null
    description?: string | null
    prefix?: string | null
    featuredImage?: string | null
    supportUrl?: string | null
    remark?: string | null
    pricingTag?: AppPricing | null
    price?: number | null
    currentVersion?: number | null
    createdAt?: Timestamp
    updatedAt?: Timestamp
    deletedAt?: Timestamp | null
}

export const mockApps: App[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'PhotoEdit Pro',
    ownerId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    status: 'PUBLISHED',
    isAutoPublished: false,
    type: 'TOOL',
    mezonAppId: 'photoedit-001',
    headline: 'Professional photo editing',
    description:
      'PhotoEdit Pro is a powerful yet intuitive photo editing application designed for both beginners and professionals. It includes advanced tools for color correction, filters, cropping, and background removal. The app supports high-resolution exports and integrates directly with your cloud storage for instant sharing. With its clean interface and smart AI enhancements, you can easily turn ordinary photos into stunning visuals.',
    prefix: 'photoedit',
    featuredImage:
      'https://picsum.photos/seed/11111111-1111-1111-1111-111111111111/240/240',
    supportUrl: 'https://support.example.com/photoedit',
    remark: 'All requirements met',
    pricingTag: 'PAID',
    price: 4.99,
    currentVersion: 210,
    createdAt: '2025-10-01T09:00:00.000Z',
    updatedAt: '2025-10-10T10:00:00.000Z',
    deletedAt: null,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'TaskMaster',
    ownerId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    status: 'REJECTED',
    isAutoPublished: true,
    type: 'TOOL',
    mezonAppId: 'taskmaster-01',
    headline: 'Task management made simple',
    description:
      'TaskMaster helps teams organize projects, assign responsibilities, and stay focused on priorities. With real-time collaboration, smart notifications, and progress tracking dashboards, it simplifies daily workflow management. Users can create boards, set recurring reminders, and integrate with productivity apps like Slack and Google Calendar. Unfortunately, the latest version was rejected due to security vulnerabilities that need to be resolved before republishing.',
    prefix: 'taskmaster',
    featuredImage:
      'https://picsum.photos/seed/22222222-2222-2222-2222-222222222222/240/240',
    supportUrl: '',
    remark: 'Security vulnerabilities found',
    pricingTag: 'FREE',
    price: 0,
    currentVersion: 151,
    createdAt: '2025-09-15T08:30:00.000Z',
    updatedAt: '2025-10-20T12:00:00.000Z',
    deletedAt: null,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'NoteQuick',
    ownerId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    status: 'PENDING',
    isAutoPublished: false,
    type: 'BOT',
    mezonAppId: 'notequick-01',
    headline: 'Fast note taking',
    description:
      'NoteQuick is a lightweight and intelligent note-taking assistant that helps users capture ideas instantly. It supports voice-to-text, markdown formatting, and smart tagging to keep your notes organized. Designed for speed, NoteQuick opens instantly and syncs seamlessly across devices. The app also includes a chatbot that can summarize, categorize, and even suggest follow-up actions based on your notes. Currently awaiting review for approval.',
    prefix: 'notequick',
    featuredImage:
      'https://picsum.photos/seed/33333333-3333-3333-3333-333333333333/240/240',
    supportUrl: '',
    remark: 'Awaiting review',
    pricingTag: 'FREE',
    price: 0,
    currentVersion: 1,
    createdAt: '2025-10-25T09:30:00.000Z',
    updatedAt: '2025-10-25T09:30:00.000Z',
    deletedAt: null,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'FitPlan Lite',
    ownerId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    status: 'PENDING',
    isAutoPublished: false,
    type: 'SERVICE',
    mezonAppId: 'fitplan-lite',
    headline: 'Personal fitness plans',
    description:
      'FitPlan Lite is a personalized fitness service that builds workout and nutrition plans based on your goals, habits, and fitness level. The app offers guided routines, progress tracking, and AI-powered recommendations that adapt as you improve. Whether you are training at home or at the gym, FitPlan Lite helps you stay motivated with achievements and daily reminders. Some documentation is still missing before it can be officially reviewed.',
    prefix: 'fitplan',
    featuredImage:
      'https://picsum.photos/seed/44444444-4444-4444-4444-444444444444/240/240',
    supportUrl: '',
    remark: 'Missing some docs',
    pricingTag: 'PAID',
    price: 2.99,
    currentVersion: 0.1,
    createdAt: '2025-10-26T11:00:00.000Z',
    updatedAt: '2025-10-26T11:00:00.000Z',
    deletedAt: null,
  },
];

export const mockOwners = [
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Creative Studios', profileImage: '/assets/imgs/owner1.png' },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Productivity Inc', profileImage: '/assets/imgs/owner2.png' }
]

export interface AppVersion {
    id: UUID
    appId: UUID
    name?: string | null
    status?: AppStatus
    isAutoPublished?: boolean
    headline?: string | null
    description?: string | null
    prefix?: string | null
    featuredImage?: string | null
    supportUrl?: string | null
    remark?: string | null
    price?: number | null
    pricingTag?: AppPricing | null
    version?: number
    changelog?: string | null
    createdAt?: Timestamp
    updatedAt?: Timestamp
    deletedAt?: Timestamp | null
}

export const mockAppVersions: AppVersion[] = [
    {
        id: 'v1111111-1111-1111-1111-111111111111',
        appId: '11111111-1111-1111-1111-111111111111',
        name: 'PhotoEdit Pro v2.1.0',
        status: 'PUBLISHED',
        isAutoPublished: false,
        headline: 'v2.1.0',
        description: 'Minor improvements and bug fixes',
        pricingTag: 'PAID',
        price: 4.99,
        version: 2.1,
        changelog: 'UI improvements, performance fixes',
        createdAt: '2025-10-05T09:00:00.000Z',
        updatedAt: '2025-10-06T09:00:00.000Z',
        deletedAt: null
    },
    {
        id: 'v2222222-2222-2222-2222-222222222222',
        appId: '22222222-2222-2222-2222-222222222222',
        name: 'TaskMaster v1.5.1',
        status: 'REJECTED',
        isAutoPublished: true,
        headline: 'v1.5.1',
        description: 'Security-related changes',
        pricingTag: 'FREE',
        price: 0,
        version: 1.5,
        changelog: 'Security fixes needed',
        createdAt: '2025-10-18T10:00:00.000Z',
        updatedAt: '2025-10-19T11:00:00.000Z',
        deletedAt: null
    }
    ,
    {
        id: 'v3333333-3333-3333-3333-333333333333',
        appId: '33333333-3333-3333-3333-333333333333',
        name: 'NoteQuick v0.1.0',
        status: 'PENDING',
        isAutoPublished: false,
        headline: 'v0.1.0',
        description: 'Initial beta release',
        pricingTag: 'FREE',
        price: 0,
        version: 0.1,
        changelog: 'Beta release: basic note creation and tagging',
        createdAt: '2025-10-25T09:30:00.000Z',
        updatedAt: '2025-10-25T09:30:00.000Z',
        deletedAt: null
    },
    {
        id: 'v4444444-4444-4444-4444-444444444444',
        appId: '44444444-4444-4444-4444-444444444444',
        name: 'FitPlan Lite v0.1',
        status: 'PENDING',
        isAutoPublished: false,
        headline: 'v0.1',
        description: 'Preview release for early testers',
        pricingTag: 'PAID',
        price: 2.99,
        version: 0.1,
        changelog: 'Preview: plan generator and basic tracking',
        createdAt: '2025-10-26T11:00:00.000Z',
        updatedAt: '2025-10-26T11:00:00.000Z',
        deletedAt: null
    }
]

export interface AppReview {
    id: UUID
    appId: UUID
    appVersionId: UUID
    reviewerId: UUID
    isApproved: boolean
    remark?: string | null
    reviewedAt?: Timestamp
    createdAt?: Timestamp
    updatedAt?: Timestamp
    deletedAt?: Timestamp | null
}

type SearchArgs = {
    search?: string
    ownerId?: string
    pageSize: number
    pageNumber: number
    sortField?: string
    sortOrder?: 'ASC' | 'DESC'
}

export function useLazyMezonAppControllerListAdminMezonAppQuery() {
    const [data, setData] = useState<{ data: GetMezonAppDetailsResponse[]; totalCount: number } | undefined>(undefined)

    const trigger = useCallback(async (args: Partial<SearchArgs> = { pageNumber: 1, pageSize: 10 }) => {
        const pageNumber = args.pageNumber || 1
        const pageSize = args.pageSize || 10

        let list = mockApps.map(a => ({
            id: a.id,
            name: a.name,
            description: a.description || '',
            prefix: a.prefix || '',
            headline: a.headline || '',
            featuredImage: a.featuredImage || '',
            status: 1,
            owner: mockOwners.find(o => o.id === a.ownerId) || { id: a.ownerId, name: 'Unknown' },
            pricingTag: a.pricingTag || 'FREE',
            price: a.price || 0,
            type: a.type,
            mezonAppId: a.mezonAppId,
            supportUrl: a.supportUrl || ''
        }))

        if (args.ownerId) list = list.filter(i => i.owner.id === args.ownerId)
        if (args.search) list = list.filter(i => i.name.toLowerCase().includes((args.search || '').toLowerCase()))

        const totalCount = list.length
        const start = (pageNumber - 1) * pageSize
        const page = list.slice(start, start + pageSize)

        const res = { data: page, totalCount }
        setData(res)
        return res
    }, [])

    return [trigger, { data }] as const
}

export function useMezonAppControllerGetMezonAppDetailQuery(id?: string) {
    const [data, setData] = useState<GetMezonAppDetailsResponse | undefined>(undefined)

    useEffect(() => {
        if (!id) {
            setData(undefined)
            return
        }
        const a = mockApps.find(x => x.id === id)
        if (!a) {
            setData(undefined)
            return
        }
        setData({
            id: a.id,
            name: a.name,
            description: a.description || '',
            prefix: a.prefix || '',
            headline: a.headline || '',
            featuredImage: a.featuredImage || '',
            status: 1,
            owner: mockOwners.find(o => o.id === a.ownerId) || { id: a.ownerId, name: 'Unknown' },
            pricingTag: a.pricingTag || 'FREE',
            price: a.price || 0,
            type: a.type,
            mezonAppId: a.mezonAppId,
            supportUrl: a.supportUrl || ''
        })
    }, [id])

    return { data }
}

export function useMezonAppControllerUpdateMezonAppMutation() {
    const fn = useCallback(async ({ updateMezonAppRequest }: { updateMezonAppRequest: Partial<App> & { id: string } }) => {
        const idx = mockApps.findIndex(a => a.id === updateMezonAppRequest.id)
        if (idx === -1) return Promise.reject({ data: { message: 'Not found' } })
        mockApps[idx] = { ...mockApps[idx], ...updateMezonAppRequest }
        return Promise.resolve(mockApps[idx])
    }, [])

    return [fn] as const
}

export default {
    apps: mockApps,
    owners: mockOwners,
    appVersions: mockAppVersions,
}
