import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QrCode } from 'lucide-react'
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import { Link } from 'react-router-dom'
import { getUrlMedia } from '@app/utils/stringHelper'
import { avatarBotDefault } from '@app/assets'
import Button from '@app/mtb-ui/Button'

const MessageButton = ({ data }: { data: GetMezonAppDetailsResponse }) => {
  const { t } = useTranslation()
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
    <Button color='primary' variant='outlined' size='large'>
      <Link
        to={`https://mezon.ai/chat/${data?.mezonAppId}?data=${dataBot}`}
        className='flex gap-1 items-center justify-center'
      >
        <QrCode size={18} />
        <span>{t('bot_detail.chat_now')}</span>
      </Link>
    </Button>
  )
}

export default MessageButton
