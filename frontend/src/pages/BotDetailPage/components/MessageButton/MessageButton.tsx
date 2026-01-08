import { useTranslation } from 'react-i18next'
import { QrCode } from 'lucide-react'
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import Button from '@app/mtb-ui/Button'
import { useBotInteractions } from '@app/hook/useBotInteractions'

const MessageButton = ({ data }: { data: GetMezonAppDetailsResponse }) => {
  const { t } = useTranslation(['bot_detail_page'])
  const { handleChatNow } = useBotInteractions(data)

  return (
    <Button 
      color='primary' 
      variant='outlined' 
      size='large' 
      onClick={handleChatNow}
    >
      <div className='flex gap-1 items-center justify-center cursor-pointer'>
        <QrCode size={18} />
        <span>{t('bot_detail.chat_now')}</span>
      </div>
    </Button>
  )
}

export default MessageButton