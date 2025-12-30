import RichTextEditor from '@app/components/RichText/RichText'
import { useMezonAppControllerUpdateMezonAppMutation } from '@app/services/api/mezonApp/mezonApp'
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import { Form, Input, Modal } from 'antd'
import Button from '@app/mtb-ui/Button'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const EditModal = ({
  isVisible,
  selectedApp,
  onClose,
}: {
  isVisible: boolean;
  selectedApp?: GetMezonAppDetailsResponse;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const [updateMezonApp, { isLoading }] = useMezonAppControllerUpdateMezonAppMutation();

  useEffect(() => {
    if (selectedApp) {
      form.setFieldsValue(selectedApp);
    }
  }, [selectedApp, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateMezonApp({ updateMezonAppRequest: { ...values, id: selectedApp?.id } }).unwrap();
      toast.success("App updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update app");
    }
  };

  return (
    <Modal
      title="Edit App"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" variant='outlined' onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={isLoading} onClick={handleSave}>
          Save
        </Button>,
      ]}
      width={700}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="max-w-full">
          <Form.Item name="name" label="App Name" rules={[
            { required: true, message: "App Name is required" },
            { min: 3, message: "App Name must be at least 3 characters" },
            { max: 128, message: "App Name must not exceed 128 characters" },
          ]}>
            <Input />
          </Form.Item>
          <Form.Item name="headline" label="Headline" rules={[
            () => ({
              // antd's custom validator
              validator(_, value) {
                if (!value || value.length < 50) return Promise.reject("Headline must be at least 50 characters");
                if (value.length > 510) return Promise.reject("Headline must not exceed 510 characters");
                return Promise.resolve();
              },
            }),
          ]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
              <RichTextEditor customClass="custom-editor" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default EditModal
