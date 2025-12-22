import { useFormContext } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Button from '@app/mtb-ui/Button'
import { Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { BotWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'

export default function NewBotWizardStep5() {
    const { getValues, setValue } = useFormContext<BotWizardRequest>()
    const values = getValues()
    const {templateJson, ...rest} = values

    const [copied, setCopied] = useState(false)
    const copyData = useCallback(() => {
        const text = JSON.stringify(values, null, 2)
        navigator?.clipboard?.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        })
    }, [values])

    useEffect(() => {
        setValue('templateJson', JSON.stringify(rest, null, 2))
    }, [])

    return (
        <div className='flex flex-col gap-3'>
            <div className='p-4 border border-border rounded-xl bg-container shadow-sm'>
                <div className='flex items-center justify-between mb-3'>
                    <div className='font-semibold'>Configuration Payload Preview</div>
                    <Tooltip title={copied ? 'Copied!' : 'Copy JSON'}>
                        <Button size='small' variant='outlined' onClick={copyData}>
                            <CopyOutlined />
                        </Button>
                    </Tooltip>
                </div>
                <div className="bg-container p-4 rounded-md border border-border shadow-sm max-h-[400px] overflow-auto">
                    <pre className='text-xs whitespace-pre-wrap font-mono'>
                        {JSON.stringify(rest, null, 2)}
                    </pre>
                </div>
                <div className="mt-2 text-xs text-secondary text-center font-semibold">
                    Review your configuration before submitting.
                </div>
            </div>
        </div>
    )
}
