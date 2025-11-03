import type {
  GetMezonAppDetailsResponse,
  OwnerInMezonAppDetailResponse,
  TagInMezonAppDetailResponse,
  SocialLinkInMezonAppDetailResponse
} from '@app/services/api/mezonApp/mezonApp'
import { AppStatus } from '@app/enums/AppStatus.enum'
import { AppPricing } from '@app/enums/appPricing'
import { MezonAppType } from '@app/enums/mezonAppType.enum'

export const mockApps: GetMezonAppDetailsResponse[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'PhotoEdit Pro',
    currentVersion: 2.1,
    prefix: 'photoedit',
    headline: 'Professional photo editing',
    description: `
      <p><strong>PhotoEdit Pro</strong> is a powerful yet intuitive photo editing application designed for both beginners and professionals.</p>
      <p>It includes advanced tools for:</p>
      <ul>
        <li>Color correction</li>
        <li>Filters</li>
        <li>Cropping</li>
        <li>Background removal</li>
      </ul>
      <p>The app supports high-resolution exports and integrates directly with your cloud storage for instant sharing. With its clean interface and smart AI enhancements, you can easily turn ordinary photos into stunning visuals.</p>
    `,
    featuredImage:
      'https://picsum.photos/seed/11111111-1111-1111-1111-111111111111/240/240',
    status: AppStatus.PUBLISHED,
    owner: { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Creative Studios', profileImage: '' } as OwnerInMezonAppDetailResponse,
    tags: [] as TagInMezonAppDetailResponse[],
    pricingTag: AppPricing.PAID,
    price: 4.99,
    rateScore: 4.7,
    type: MezonAppType.APP,
    mezonAppId: 'photoedit-001',
    supportUrl: 'https://support.example.com/photoedit',
    socialLinks: [] as SocialLinkInMezonAppDetailResponse[],
    versions: [
      {
        id: 'v1111111-1111-1111-1111-111111111111',
        status: AppStatus.PUBLISHED,
        version: 2.1,
        changelog: 'UI improvements, performance fixes',
      }
    ],
    hasNewUpdate: false,
    updatedAt: '2025-06-10T12:34:56Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'TaskMaster',
    currentVersion: 1.5,
    prefix: 'taskmaster',
    headline: 'Task management made simple',
    description: `
      <p><strong>TaskMaster</strong> helps teams organize projects, assign responsibilities, and stay focused on priorities. With real-time collaboration, smart notifications, and progress tracking dashboards, it simplifies daily workflow management.</p>
      <p>Users can create boards, set recurring reminders, and integrate with productivity apps like <em>Slack</em> and <em>Google Calendar</em>.</p>
      <p><strong>Note:</strong> Unfortunately, the latest version was rejected due to security vulnerabilities that need to be resolved before republishing.</p>
    `,
    featuredImage:
      'https://picsum.photos/seed/22222222-2222-2222-2222-222222222222/240/240',
    status: AppStatus.REJECTED,
    owner: { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Productivity Inc', profileImage: '' } as OwnerInMezonAppDetailResponse,
    tags: [] as TagInMezonAppDetailResponse[],
    pricingTag: AppPricing.FREE,
    price: 0,
    rateScore: 3.9,
    type: MezonAppType.BOT,
    mezonAppId: 'taskmaster-01',
    supportUrl: '',
    socialLinks: [] as SocialLinkInMezonAppDetailResponse[],
    versions: [
      {
        id: 'v2222222-2222-2222-2222-222222222222',
        status: AppStatus.REJECTED,
        version: 1.5,
        changelog: 'Security fixes needed',
      }
    ],
    hasNewUpdate: false,
    updatedAt: '2025-06-08T09:21:45Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'NoteQuick',
    currentVersion: 0.1,
    prefix: 'notequick',
    headline: 'Fast note taking',
    description: `
      <p><strong>NoteQuick</strong> is a lightweight and intelligent note-taking assistant that helps users capture ideas instantly. Designed for speed, it opens instantly and syncs seamlessly across devices.</p>
      <p>Key features include:</p>
      <ul>
        <li>Voice-to-text</li>
        <li>Markdown formatting</li>
        <li>Smart tagging to keep notes organized</li>
        <li>An integrated chatbot to summarize, categorize, and suggest actions</li>
      </ul>
      <p><em>Currently awaiting review for approval.</em></p>
    `,
    featuredImage:
      'https://picsum.photos/seed/33333333-3333-3333-3333-333333333333/240/240',
    status: AppStatus.PENDING,
    owner: { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Creative Studios', profileImage: '' } as OwnerInMezonAppDetailResponse,
    tags: [] as TagInMezonAppDetailResponse[],
    pricingTag: AppPricing.FREE,
    price: 0,
    rateScore: 0,
    type: MezonAppType.BOT,
    mezonAppId: 'notequick-01',
    supportUrl: '',
    socialLinks: [] as SocialLinkInMezonAppDetailResponse[],
    versions: [
      {
        id: 'v3333333-3333-3333-3333-333333333333',
        status: AppStatus.PENDING,
        version: 0.1,
        changelog: 'Beta release: basic note creation and tagging',
      }
    ],
    hasNewUpdate: false,
    updatedAt: '2025-06-05T15:45:30Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'FitPlan Lite',
    currentVersion: 0.1,
    prefix: 'fitplan',
    headline: 'Personal fitness plans',
    description: `
      <p><strong>FitPlan Lite</strong> is a personalized fitness service that builds workout and nutrition plans based on your goals, habits, and fitness level.</p>
      <p>The app offers guided routines, progress tracking, and AI-powered recommendations that adapt as you improve. Whether you are training at home or at the gym, FitPlan Lite helps you stay motivated with achievements and daily reminders.</p>
      <p><em>(Some documentation is still missing before it can be officially reviewed.)</em></p>
    `,
    featuredImage:
      'https://picsum.photos/seed/44444444-4444-4444-4444-444444444444/240/240',
    status: AppStatus.PENDING,
    owner: { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Productivity Inc', profileImage: '' } as OwnerInMezonAppDetailResponse,
    tags: [] as TagInMezonAppDetailResponse[],
    pricingTag: AppPricing.PAID,
    price: 2.99,
    rateScore: 0,
    type: MezonAppType.APP,
    mezonAppId: 'fitplan-lite',
    supportUrl: '',
    socialLinks: [] as SocialLinkInMezonAppDetailResponse[],
    versions: [
      {
        id: 'v4444444-4444-4444-4444-444444444444',
        status: AppStatus.PENDING,
        version: 0.1,
        changelog: 'Preview: plan generator and basic tracking',
      }
    ],
    hasNewUpdate: false,
    updatedAt: '2025-06-05T15:45:30Z',
  },
];