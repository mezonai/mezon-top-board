import { useState } from 'react';
import { Button, Modal, Tabs } from 'antd';
import { toast } from 'react-toastify';
import { imageMimeTypes } from '@app/constants/mimeTypes';
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media';
import { getUrlMedia } from '@app/utils/stringHelper';

const MediaManagerModal = ({
  isVisible,
  onChoose,
  onClose,
}: {
  isVisible: boolean;
  onChoose: (path: string) => void;
  onClose: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadImage, { isLoading }] = useMediaControllerCreateMediaMutation()

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    const maxFileSize = 4 * 1024 * 1024
    if (file.size > maxFileSize) {
      toast.error(`${file.name} file upload failed (exceeds 4MB)`);
      return ;
    }
    
    if (!imageMimeTypes.includes(file.type)) {
      toast.error('Please upload a valid image file!');
      onError(new Error('Invalid file type'));
      return;
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await uploadImage(formData).unwrap()

      if (response?.statusCode === 200) {
        onChoose(getUrlMedia(response?.data?.filePath))
      }

      onSuccess(response, file)
      toast.success('Upload Success')
    } catch (error) {
      toast.error('Upload failed!')
      onError(error)
    }
  }
  return (
    <Modal
      title="Basic Modal"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isVisible}
      onCancel={onClose}
    >
      <Tabs
        onChange={() => {}}
        type="card"
        items={Array.from({ length: 3 }).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Tab ${id}`,
            key: id,
            children: `Content of Tab Pane ${id}`,
          };
        })}
      />
    </Modal>
  );
};

export default MediaManagerModal;