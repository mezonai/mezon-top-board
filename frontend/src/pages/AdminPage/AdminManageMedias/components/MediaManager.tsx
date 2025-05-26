import { UploadOutlined } from '@ant-design/icons'

import { use, useEffect, useState } from 'react'
import { Modal, Spin, Tabs, Upload } from 'antd'
import { toast } from 'react-toastify'
import { imageMimeTypes } from '@app/constants/mimeTypes'
import {
  useLazyMediaControllerGetAllMediaQuery,
  useMediaControllerCreateMediaMutation,
} from '@app/services/api/media/media'
import { getUrlMedia } from '@app/utils/stringHelper'
import Button from '@app/mtb-ui/Button'
import { useAppSelector } from '@app/store/hook'
import { RootState } from '@app/store'

const MediaManagerModal = ({
  isVisible,
  onChoose,
  onClose
}: {
  isVisible: boolean
  onChoose: (path: string) => void
  onClose: () => void
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState('1')

  const [uploadImage, { isLoading: uploading }] = useMediaControllerCreateMediaMutation()
  const [getAllMedia, { isLoading: loadingMedia, isSuccess }] = useLazyMediaControllerGetAllMediaQuery()
  const mediaList = useAppSelector((state: RootState) => state.media.mediaList)

  useEffect(() => {
    getMediasList()
  }, [])
  const getMediasList = () => {
    getAllMedia({
      pageNumber: 1,
      pageSize: 20,
      sortField: 'createdAt',
      sortOrder: 'ASC'
    })
    isSuccess && toast.success('Get media list success')
  }

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    const maxFileSize = 4 * 1024 * 1024
    if (file.size > maxFileSize) {
      toast.error(`${file.name} file upload failed (exceeds 4MB)`)
      return
    }
    if (!imageMimeTypes.includes(file.type)) {
      toast.error('Please upload a valid image file!')
      onError(new Error('Invalid file type'))
      return
    }
    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file))
    onSuccess('ok')
  }

  const tabItems = [
    {
      label: 'Upload from device',
      key: '1',
      children: (
        <div className='flex flex-col items-center mt-4'>
          <Upload customRequest={handleUpload} showUploadList={false} accept='image/*'>
            <Button icon={<UploadOutlined />} loading={uploading}>
              Click to Upload
            </Button>
          </Upload>
          <i>Choose an image in your browser</i>
          {selectedFile && (
            <img
              src={selectedImage || ''}
              alt=''
              className="w-[100px] h-[100px] object-cover mt-[10px]"
            />
          )}
        </div>
      )
    },
    {
      label: 'Choose from gallery',
      key: '2',
      children: loadingMedia ? (
        <Spin />
      ) : (
        <div className='flex flex-wrap gap-2 max-h-[350px] overflow-y-auto '>
          {mediaList?.data?.map((item: any) => {
            const url = getUrlMedia(item.filePath)
            return (
              <img
                key={item.id}
                src={url}
                alt=''
                className={'w-[6.5rem] h-[6.5rem] object-cover cursor-pointer'}
                style={{border: selectedImage === url ? '2px solid blue' : '1px solid #ccc',}}
                onClick={() => setSelectedImage(url)}
              />
            )
          })}
        </div>
      )
    }
  ]

  const handleChoose = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        const response = await uploadImage(formData).unwrap()

        if (response?.statusCode === 200) {
          const imagePath = getUrlMedia(response.data.filePath)
          onChoose(imagePath)
        }
      }
      else if (selectedImage) {
        onChoose(selectedImage)
      } else {
        toast.error('Please select an image')
        return
      }

      setSelectedImage(null)
      setSelectedFile(null)
      setActiveTab('1')
      onClose()
    } catch (error) {
      toast.error('Upload failed!')
    }
  }

  const handleCancel = () => {
    setActiveTab('1')
    setSelectedFile(null)
    setSelectedImage(null)
    onClose()
  }

  return (
    <Modal
      width={'59rem'}
      centered
      title='Choose Icon'
      open={isVisible}
      onCancel={handleCancel}
      onOk={handleChoose}
    >
      <Tabs className=''
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key)
          if (key === '2') {
            setSelectedFile(null)
          }
        }}
        type='card'
        items={tabItems}
      />
    </Modal>
  )
}

export default MediaManagerModal
