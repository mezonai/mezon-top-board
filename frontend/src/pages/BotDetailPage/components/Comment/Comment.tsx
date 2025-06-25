import avatar from '@app/assets/images/default-user.webp'
import MtbRate from '@app/mtb-ui/Rate/Rate'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { Rating } from '@app/services/api/rating/rating'
import { formatAgo } from '@app/utils/date'
import { getUrlMedia } from '@app/utils/stringHelper'
import { Link } from 'react-router-dom'
function Comment({ rating }: { rating: Rating }) {
  return (
    <>
      <div className='flex gap-10 p-4 shadow-sm rounded-2xl'>
        <Link to={`/profile/${rating.user.id}`} className='w-15 flex-shrink-0'>
          <img
            src={rating.user?.profileImage ? getUrlMedia(rating.user?.profileImage) : avatar}
            alt=''
            className='rounded-full w-full aspect-square object-cover'
          />
        </Link>
        <div className='flex flex-col gap-5'>
          <div>
            <Link to={`/profile/${rating.user.id}`} className='inline-block'>
              <MtbTypography variant='h4' customClassName='!mt-1'>
                {rating.user.name}
              </MtbTypography>
            </Link>
            <MtbTypography variant='p' weight='italic'>
              {formatAgo(rating.updatedAt)}
            </MtbTypography>
          </div>
          <div className='flex gap-5'>
            <MtbRate value={rating.score} readonly={true}></MtbRate>
          </div>
          <MtbTypography variant='p'>{rating.comment}</MtbTypography>
          {/* <MtbTypography variant='p'>
            <LikeOutlined /> 3,800
          </MtbTypography> */}
        </div>
      </div>
    </>
  )
}

export default Comment
