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
        <div className='p-4 border border-gray-200 rounded-xl bg-white flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow group relative'>
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
                        <DeleteOutlined className="text-red-500" />
                    </Button>
                </Tooltip>
            </div>

            {data.description && (
                <div className='text-xs text-gray-600 leading-relaxed line-clamp-4'>
                    {data.description}
                </div>
            )}

            {aliases.length > 0 && (
                <div className='flex flex-wrap gap-2 pt-1 border-t border-gray-100 mt-1'>
                    {aliases.map((a) => (
                        <Tag key={a} className="text-xs bg-gray-50 text-gray-500 border-gray-200 mr-0">
                            {a}
                        </Tag>
                    ))}
                </div>
            )}
        </div>
    )
}