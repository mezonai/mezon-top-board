import { AppStatus } from '@app/enums/AppStatus.enum'
import { AppVersionDetailsDto } from '@app/services/api/mezonApp/mezonApp.types'
import { formatDate } from '@app/utils/date'
import { AlertCircle, Calendar, CheckCircle, GitCommit, Sparkles } from 'lucide-react'

// Helper component for Status Badge
export const getStatusBadge = (status: AppStatus) => {
  switch (status) {
    case AppStatus.PUBLISHED:
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          Published
        </span>
      )
    case AppStatus.PENDING:
      return (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
          <AlertCircle className="mr-1 h-3 w-3" />
          Pending
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {status}
        </span>
      )
  }
}

interface VersionTimelineProps {
  versions: AppVersionDetailsDto[]
  currentVersion: number
}

const VersionTimeline = ({ versions, currentVersion }: VersionTimelineProps) => {
  // Sort versions descending (Newest first)
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version)

  return (
    <div className="relative pl-2 py-4">
      {/* Timeline vertical line */}
      <div className="absolute left-[1.65rem] top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="flex flex-col gap-8">
        {sortedVersions.map((entry) => {
          const isLatest = entry.version === currentVersion
          // Split changelog by newline
          const changes = entry.changelog ? entry.changelog.split('\n').filter((line) => line.trim() !== '') : []

          return (
            <div key={entry.id} className="relative flex gap-6">
              {/* Timeline node */}
              <div
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gray-50 shadow-sm dark:border-gray-900 dark:bg-gray-800 ${
                  isLatest ? 'ring-2 ring-primary' : ''
                }`}
              >
                <GitCommit className={`h-6 w-6 ${isLatest ? 'text-primary' : 'text-gray-400'}`} />
              </div>

              {/* Version card */}
              <div
                className={`flex-1 rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${
                  isLatest ? 'border-primary/30 ring-1 ring-primary/20' : 'border-gray-200'
                }`}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">v{entry.version}</span>
                      {isLatest && (
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                          Current Version
                        </span>
                      )}
                    </div>
                    {getStatusBadge(entry.status as AppStatus)}
                  </div>

                  {/* Date */}
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Released on {formatDate(entry.updatedAt)}</span>
                  </div>

                  {/* Changelog */}
                  {changes.length > 0 ? (
                    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Changelog
                      </h4>
                      <ul className="flex flex-col gap-2.5">
                        {changes.map((change, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white shadow-sm dark:bg-gray-800">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400">No changelog details provided.</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VersionTimeline