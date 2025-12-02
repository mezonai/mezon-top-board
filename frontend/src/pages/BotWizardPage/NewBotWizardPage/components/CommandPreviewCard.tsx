import { Tag, Tooltip } from 'antd'
import Button from '@app/mtb-ui/Button'
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import { useCallback, useState } from 'react'
import type { WizardCommand } from '../../MockData'

interface Props {
    data: WizardCommand
    index: number
    onRemove: () => void
}

export default function CommandPreviewCard({ data, onRemove }: Props) {
    const [copied, setCopied] = useState(false)

    const copyUsage = useCallback(() => {
        if (!data.usage) return
        navigator?.clipboard?.writeText(data.usage).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        })
    }, [data.usage])

    const aliases = data.aliases || []

    return (
        <div className='p-4 border border-gray-200 rounded-xl bg-white flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between'>
                <div className='flex flex-row gap-4 items-center'>
                    <div className='font-semibold text-sm'>{data.name || '(no name)'}</div>
                    {data.category && <Tag color='blue'>{data.category}</Tag>}
                </div>
                <div className='flex gap-2'>
                    {data.usage && (
                        <Tooltip title={copied ? 'Copied!' : 'Copy usage'}>
                            <Button size='small' variant='outlined' onClick={copyUsage}>
                                <CopyOutlined />
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip title='Remove'>
                        <Button size='small' variant='outlined' onClick={onRemove}>
                            <DeleteOutlined />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            {data.description && (
                <div className='text-xs text-gray-600 leading-relaxed line-clamp-4'>{data.description}</div>
            )}
            {aliases.length > 0 && (
                <div className='flex flex-wrap gap-2 pt-1'>
                    {aliases.map((a) => (
                        <Tag key={a}>{a}</Tag>
                    ))}
                </div>
            )}
        </div>
    )
}
