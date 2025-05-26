import { Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import MtbButton from '@app/mtb-ui/Button';
import { EditOutlined } from '@ant-design/icons';
import MediaManagerModal from '../../AdminManageMedias/components/MediaManager';
import { useForm } from 'react-hook-form';

export interface LinkTypeFormValues {
  name: string;
  prefixUrl: string;
  icon: string | File;
}

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (values: LinkTypeFormValues) => void;
}

const CreateLinkTypeModal = ({ open, onClose, onCreate }: CreateTagModalProps) => {
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<LinkTypeFormValues>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const icon = watch('icon');
  const selectedImage = typeof icon === 'string'
    ? icon
    : icon instanceof File
      ? URL.createObjectURL(icon)
      : null;

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const handleChooseImage = (image: File | string) => {
    if (!image) {
      message.error('Please select an image');
      return;
    }
    setValue('icon', image, { shouldValidate: true });
    setIsModalVisible(false);
  };

  const onSubmit = (values: LinkTypeFormValues) => {
    onCreate({
      name: values.name.trim(),
      prefixUrl: values.prefixUrl.trim(),
      icon: values.icon
    });
    reset();
  };

  return (
    <Modal
      title="Create New Tag"
      open={open}
      onCancel={onClose}
      footer={<MtbButton onClick={handleSubmit(onSubmit)}>Add</MtbButton>}
      width={600}
      centered
    >
      <div className="flex flex-col gap-4 pt-2">
        <div>
          <label>Name</label>
          <input {...register('name', { required: true })} className="mtb-input w-full" />
          {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label>Prefix URL</label>
          <input {...register('prefixUrl', { required: true })} className="mtb-input w-full" />
          {errors.prefixUrl && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label>Icon</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected Icon"
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }}
              />
            ) : (
              <div style={{ width: 60, height: 60, backgroundColor: '#f0f0f0', border: '1px dashed #ccc', borderRadius: 4 }} />
            )}
            <MtbButton icon={<EditOutlined />} onClick={() => setIsModalVisible(true)}>
              Choose Image
            </MtbButton>
          </div>
          {!icon && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
      </div>

      <MediaManagerModal
        isVisible={isModalVisible}
        onChoose={handleChooseImage}
        onClose={() => setIsModalVisible(false)}
      />
    </Modal>
  );
};

export default CreateLinkTypeModal;
