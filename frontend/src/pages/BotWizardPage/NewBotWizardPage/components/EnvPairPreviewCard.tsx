import { Tooltip } from 'antd'
import Button from '@app/mtb-ui/Button'
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import { useCallback, useState } from 'react'

export type EnvPairPreview = {
    keyName: string
    value: string
}

type Props = {
    data: EnvPairPreview
    onRemove?: () => void
}

export default function EnvPairPreviewCard({ data, onRemove }: Props) {
    const [copied, setCopied] = useState(false)

    const copy = useCallback(() => {
        const text = `${data.keyName} = ${data.value}`
        if (!text) return
        navigator?.clipboard?.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        })
    }, [data.keyName, data.value])

    return (
        <div className='p-4 border border-gray-200 rounded-xl bg-white flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between'>
                <div className='flex flex-row gap-4 items-center'>
                    <div className='font-semibold text-sm'>{data.keyName || '(no key)'}</div>
                </div>
                <div className='flex gap-2'>
                    <Tooltip title={copied ? 'Copied!' : 'Copy KEY=VALUE'}>
                        <Button size='small' variant='outlined' onClick={copy}>
                            <CopyOutlined />
                        </Button>
                    </Tooltip>
                    {onRemove ? (
                        <Tooltip title='Remove'>
                            <Button size='small' variant='outlined' onClick={onRemove}>
                                <DeleteOutlined />
                            </Button>
                        </Tooltip>
                    ) : null}
                </div>
            </div>
            <div className='text-xs text-gray-700 leading-relaxed font-mono break-all'>
                {`${data.keyName} = ${data.value}`}
            </div>
        </div>
    )
}
