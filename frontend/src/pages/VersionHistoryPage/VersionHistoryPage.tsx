import DetailCard from '@app/pages/BotDetailPage/components/DetailCard/DetailCard'
import { AppStatus } from '@app/enums/AppStatus.enum' // Đảm bảo Enum này đúng thứ tự 0,1,2,3
import Button from '@app/mtb-ui/Button'
import { useLazyMezonAppControllerGetMezonAppDetailQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { RootState } from '@app/store'
import { IMezonAppStore } from '@app/store/mezonApp'
import { ITagStore } from '@app/store/tag'
import { ApiError } from '@app/types/API.types'
import { formatAgo, formatDate } from '@app/utils/date'
import { Spin } from 'antd'
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  GitCommit, 
  History, 
  AlertCircle,
  XCircle
} from 'lucide-react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const getStatusBadge = (status: AppStatus, t: (key: string, opts?: any) => string) => {
  switch (status) {
    case AppStatus.PUBLISHED:
      return (
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          {t('status.published')}
        </span>
      )
    case AppStatus.APPROVED:
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          {t('status.approved')}
        </span>
      )
    case AppStatus.PENDING:
      return (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
          <AlertCircle className="mr-1 h-3 w-3" />
          {t('status.pending')}
        </span>
      )
    case AppStatus.REJECTED:
      return (
        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          <XCircle className="mr-1 h-3 w-3" />
          {t('status.rejected')}
        </span>
      )

    default:
      return null
  }
}

function VersionHistoryPage() {
  const navigate = useNavigate()
  const { botId } = useParams()
  const { t } = useTranslation('version_history')
  
  const [getMezonAppDetail, { isError, error, isFetching }] = useLazyMezonAppControllerGetMezonAppDetailQuery()
  const [getTagList] = useLazyTagControllerGetTagsQuery()
  
  const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)

  const versions = Array.isArray(mezonAppDetail?.versions) ? mezonAppDetail.versions : []
  const latestVersion = versions[0]

  useEffect(() => {
    if (botId && botId !== 'undefined') {
      if (!mezonAppDetail.id || mezonAppDetail.id !== botId) {
        getMezonAppDetail({ id: botId })
      }
    } else {
      navigate('/404', { replace: true })
    }
  }, [botId, mezonAppDetail.id])

  useEffect(() => {
    if (!tagList?.data?.length) getTagList()
  }, [])

  useEffect(() => {
    if (isError && error) {
      const apiError = error as ApiError
      if (apiError?.status === 404) navigate('/404')
      else toast.error(apiError?.data?.message)
    }
  }, [isError, error])

  if (isFetching && (!mezonAppDetail.id || mezonAppDetail.id !== botId)) {
    return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>
  }

  if (!mezonAppDetail.id) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 lg:w-2/3">
            <div className="mb-6">
              <Button 
                variant="link" 
                onClick={() => navigate(`/bot/${botId}`)}
                className="gap-2 !pl-0 text-secondary hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('actions.backToBot')}
              </Button>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-heading sm:text-3xl">{t('header.title')}</h1>
                  <p className="text-sm text-secondary">
                    {t('header.subtitle', { name: mezonAppDetail.name })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-container p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">{t('meta.latest')}</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  v{latestVersion?.version || '0'}
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">{t('meta.totalReleases')}</span>
                <span className="text-sm font-medium text-heading">{mezonAppDetail.versions.length}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">{t('meta.lastUpdated')}</span>
                <span className="text-sm font-medium text-heading">
                  {latestVersion ? formatAgo(latestVersion.updatedAt, t) : '-'}
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-6 top-0 h-full w-0.5 bg-border" />
              
              <div className="flex flex-col gap-6">
                {versions.map((entry) => {
                  const isLatest = entry.version === latestVersion?.version;
                  const changes = entry.changelog 
                    ? entry.changelog.split('\n').filter(line => line.trim() !== '') 
                    : [];

                  return (
                    <div key={entry.id} className="relative flex gap-4">
                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-container shadow-sm">
                        <GitCommit className={`h-5 w-5 ${isLatest ? "text-primary" : "text-secondary"}`} />
                      </div>
                      
                      <div className={`flex-1 rounded-xl border bg-container shadow-sm transition-shadow hover:shadow-md ${isLatest ? "border-primary/30 ring-1 ring-primary/20" : "border-border"}`}>
                        <div className="p-5">
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-heading">v{entry.version}</span>
                              {isLatest && (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                  {t('items.currentVersion')}
                                </span>
                              )}
                            </div>
                            {getStatusBadge(entry.status, t)}
                          </div>
                          
                          <div className="mb-4 flex items-center gap-2 text-sm text-secondary">
                            <Calendar className="h-4 w-4" />
                            <span>{t('items.releasedOn', { date: formatDate(entry.updatedAt) })}</span>
                          </div>
                          
                          <div className="rounded-lg border border-border bg-background-secondary p-4">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-secondary">
                              {t('changelog.title')}
                            </h4>
                            {changes.length > 0 ? (
                              <ul className="flex flex-col gap-2.5">
                                {changes.map((changeText, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <div className="flex-1">
                                      <span className="text-sm text-heading">{changeText}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm italic text-secondary">{t('changelog.noDetails')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          
          <aside className="lg:w-1/3">
            <div className="lg:sticky lg:top-24">
              <DetailCard />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default VersionHistoryPage