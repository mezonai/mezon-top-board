import { useEffect, useState } from 'react'
import { MessageCircleMore } from 'lucide-react'
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp'
import { Link } from 'react-router-dom'
import { getUrlMedia } from '@app/utils/stringHelper'
import { avatarBotDefault } from '@app/assets'

const MessageButton = ({ data }: { data: GetMezonAppDetailsResponse }) => {
  const [dataBot, setDataBot] = useState('')
  useEffect(() => {
    if (!data) return
    const payload = {
      id: data?.mezonAppId ? data.mezonAppId : '',
      name: data?.name ? data.name : 'Unknown',
      avatar: data?.featuredImage ? getUrlMedia(data.featuredImage) : avatarBotDefault
    }

    setDataBot(btoa(encodeURIComponent(JSON.stringify(payload))))
  }, [data])

  return (
    <>
      <Link
        to={`https://mezon.ai/chat/${data?.mezonAppId}?data=${dataBot}`}
        className='fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-50 cursor-pointer'
      >
        <MessageCircleMore size={26} />
      </Link>
    </>
  )
}

export default MessageButton
