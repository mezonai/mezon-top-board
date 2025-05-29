import { RiseOutlined, StarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { ICompactBotCardProps } from '@app/types/Botcard.types'
import { getUrlMedia } from '@app/utils/stringHelper'
import { avatarBotDefault } from '@app/assets'
import OwnerActions from '../OwnerActions/OwnerActions'

function CompactBotCard({ data, isPublic = true, isDragging }: ICompactBotCardProps) {
  const navigate = useNavigate()

  const handleNavigateDetail = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (data?.id) {
      navigate(`/bot/${data?.id}`)
    }
  }
  const imgUrl = data?.featuredImage ? getUrlMedia(data.featuredImage) : avatarBotDefault

  return (
    <div className='shadow-sm rounded-2xl p-4 bg-white cursor-pointer relative z-1' onClick={handleNavigateDetail}>
      <div className='relative'>
        <div className='w-20 m-auto'>
          <img src={imgUrl} alt='' className='aspect-square rounded-full object-cover w-full' width={'100%'} />
        </div>
        {!isPublic && (
          <OwnerActions data={data} />
        )}
      </div>
      <div className='pt-3 pb-3 font-black truncate'>{data?.name || 'Name'}</div>
      <div className='flex justify-between items-center'>
        <p>
          <StarOutlined /> {data?.rateScore || 0}
        </p>
        <p>
          <RiseOutlined /> 841,999
        </p>
      </div>
    </div>
  )
}

export default CompactBotCard
