import { Tag, Tooltip } from 'antd'
import Button from '@app/mtb-ui/Button' 
import { DeleteOutlined } from '@ant-design/icons'
import { CommandWizardRequest } from '@app/services/api/botGenerator/botGenerator.types'

interface Props {
    data: CommandWizardRequest
    index: number
    onRemove: () => void
}

export default function CommandPreviewCard({ data, onRemove }: Props) {
    const aliases = data.aliases || []

    return (
        <div className='p-4 border border-border rounded-xl bg-bg-container flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow group relative'>
            <div className='flex items-start justify-between'>
                <div className='flex flex-row gap-4 items-center'>
                    <div className='font-semibold text-sm'>{data.command}</div>
                    {data.category && <Tag color='blue'>{data.category}</Tag>}
                </div>
                
                <Tooltip title="Remove command">
                    <Button 
                        size="small" 
                        variant="text" 
                        color="danger"   
                        onClick={onRemove}
                        className="opacity-0 group-hover:opacity-100 transition-opacity" 
                    >
                        <DeleteOutlined className="text-danger" />
                    </Button>
                </Tooltip>
            </div>
            {data.description && (
                <div className='text-xs leading-relaxed line-clamp-4'>
                    {data.description}
                </div>
            )}
            {aliases.length > 0 && (
                <div className='flex flex-wrap gap-2 pt-2 border-t border-border mt-2'>
                    {aliases.map((a) => (
                        <Tag key={a}>{a}</Tag>
                    ))}
                </div>
            )}
        </div>
    )
}
