import { useFormContext } from 'react-hook-form'
import { useCallback, useState } from 'react'
import Button from '@app/mtb-ui/Button'
import { Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'

export default function NewBotWizardStep5() {
    const { getValues } = useFormContext<BotWizardRequest>()
    const values = getValues()

    const [copied, setCopied] = useState(false)
    const copyData = useCallback(() => {
        const text = JSON.stringify(values, null, 2)
        navigator?.clipboard?.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        })
    }, [values])

    return (
        <div className='flex flex-col gap-3'>
            <div className='p-4 border border-gray-200 rounded-xl bg-white shadow-sm'>
                <div className='flex items-center justify-between mb-3'>
                    <div className='font-semibold'>Configuration Payload Preview</div>
                    <Tooltip title={copied ? 'Copied!' : 'Copy JSON'}>
                        <Button size='small' variant='outlined' onClick={copyData}>
                            <CopyOutlined />
                        </Button>
                    </Tooltip>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100 max-h-[400px] overflow-auto">
                    <pre className='text-xs whitespace-pre-wrap font-mono'>
                        {JSON.stringify(values, null, 2)}
                    </pre>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                    Review your configuration before submitting.
                </div>
            </div>
        </div>
    )
}