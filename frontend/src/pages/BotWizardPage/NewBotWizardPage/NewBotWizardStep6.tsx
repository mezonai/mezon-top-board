import { useFormContext } from 'react-hook-form'
import { useCallback, useMemo, useState } from 'react'
import Button from '@app/mtb-ui/Button'
import { Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { WizardForm } from '../MockData'
import { buildProjectTree } from './helpers/buildPreviewTree'

export default function NewBotWizardStep6() {
    const { getValues } = useFormContext<WizardForm>()
    const values = getValues()

    const tree = useMemo(() => buildProjectTree(values), [values])

    const [copied, setCopied] = useState(false)
    const copyTree = useCallback(() => {
        const text = tree.join('\n')
        navigator?.clipboard?.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        })
    }, [tree])

    return (
        <div className='flex flex-col gap-3'>
            <div className='p-4 border border-gray-200 rounded-xl bg-white shadow-sm'>
                <div className='flex items-center justify-between mb-3'>
                    <div className='font-semibold'>Project structure preview</div>
                    <Tooltip title={copied ? 'Copied!' : 'Copy tree'}>
                        <Button size='small' variant='outlined' onClick={copyTree}>
                            <CopyOutlined />
                        </Button>
                    </Tooltip>
                </div>
                <pre className='bg-gray-50 p-4 text-sm whitespace-pre-wrap rounded-md border border-gray-100'>
                    {tree.join('\n')}
                </pre>
            </div>
        </div>
    )
}
