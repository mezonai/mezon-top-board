import { Modal, Empty, Checkbox, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import { IMezonAppStore } from '@app/store/mezonApp'
import { formatDate } from '@app/utils/date'
import Button from '@app/mtb-ui/Button'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { Copy, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState, useMemo } from 'react'
import { cn } from '@app/utils/cn'

interface ChangelogHistoryModalProps {
    isVisible: boolean
    onClose: () => void
    onSelect: (text: string) => void
}

const ChangelogHistoryModal = ({ isVisible, onClose, onSelect }: ChangelogHistoryModalProps) => {
    const { t } = useTranslation('version_history')
    const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
    const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([])

    const versionsWithChangelog = useMemo(() => {
        return mezonAppDetail?.versions?.filter(
            v => v.changelog && v.changelog.trim() !== ''
        ) || []
    }, [mezonAppDetail])

    const handleClose = () => {
        setSelectedVersionIds([])
        onClose()
    }

    const toggleSelection = (id: string) => {
        setSelectedVersionIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedVersionIds.length === versionsWithChangelog.length) {
            setSelectedVersionIds([])
        } else {
            setSelectedVersionIds(versionsWithChangelog.map(v => v.id))
        }
    }

    const handleCopySelected = () => {
        const selectedVersions = versionsWithChangelog
            .filter(v => selectedVersionIds.includes(v.id))
            .sort((a, b) => b.version - a.version)

        if (selectedVersions.length === 0) return

        const textToCopy = selectedVersions.map(v => {
            if (selectedVersions.length === 1) return v.changelog;
            return `${v.changelog}`
        }).join('\n')

        onSelect(textToCopy)
        handleClose()
    }

    return (
        <Modal
            title={
                <div className="flex items-center justify-between pr-8">
                    <MtbTypography variant="h4">{t('header.title')}</MtbTypography>
                    {versionsWithChangelog.length > 0 && (
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <Checkbox
                                checked={selectedVersionIds.length === versionsWithChangelog.length}
                                indeterminate={selectedVersionIds.length > 0 && selectedVersionIds.length < versionsWithChangelog.length}
                                onChange={toggleSelectAll}
                            />
                            <span className="text-secondary text-sm">
                                {selectedVersionIds.length === versionsWithChangelog.length
                                    ? t('actions.deselect_all')
                                    : t('actions.select_all')}
                            </span>
                        </label>
                    )}
                </div>
            }
            open={isVisible}
            onCancel={handleClose}
            centered
            styles={{ body: { maxHeight: '60vh', overflowY: 'auto' } }}
            footer={
                <div className="flex justify-between items-center pt-2">
                    <span className="text-secondary text-sm">
                        {t('header.selected_count', { count: selectedVersionIds.length })}
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outlined" onClick={handleClose}>
                            {t('actions.cancel')}
                        </Button>
                        <Button
                            disabled={selectedVersionIds.length === 0}
                            onClick={handleCopySelected}
                        >
                            {t('actions.apply')}
                        </Button>
                    </div>
                </div>
            }
            width={650}
            className="dark:bg-background-secondary"
        >
            <div className="pr-2 mt-4 custom-scrollbar flex flex-col gap-3">
                {versionsWithChangelog.length > 0 ? (
                    versionsWithChangelog.map((version) => {
                        const isSelected = selectedVersionIds.includes(version.id);
                        return (
                            <div
                                key={version.id}
                                onClick={() => toggleSelection(version.id)}
                                className={cn(
                                    "group relative flex gap-4 p-4 min-h-[80px] rounded-xl border cursor-pointer transition-all duration-200",
                                    isSelected
                                        ? "bg-primary/5 border-primary/50 shadow-[0_0_0_1px_rgba(var(--primary-rgb),0.5)]"
                                        : "bg-background-primary border-border hover:border-primary/30 hover:shadow-sm"
                                )}
                            >
                                <div className="mt-0.5">
                                    <Checkbox checked={isSelected} className="pointer-events-none" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "inline-flex items-center justify-center h-6 min-w-[44px] rounded-full px-2 text-xs font-semibold transition-colors border",
                                                isSelected ? "bg-primary text-white border-transparent" : "bg-container text-heading border-border"
                                            )}>
                                                v{version.version}
                                            </span>
                                            <span className="flex items-center text-xs text-secondary">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {formatDate(version.updatedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-heading whitespace-pre-wrap leading-relaxed">
                                        {version.changelog}
                                    </div>
                                </div>

                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Tooltip title={t('common.copy_this', 'Copy only this')}>
                                        <div
                                            className="p-2 rounded-md hover:bg-background-secondary text-secondary hover:text-primary transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(version.changelog || '');
                                                handleClose();
                                            }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t('changelog.noDetails')}
                    />
                )}
            </div>
        </Modal>
    )
}

export default ChangelogHistoryModal