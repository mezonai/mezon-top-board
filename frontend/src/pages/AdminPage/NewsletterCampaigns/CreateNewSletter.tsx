import RichTextEditor from '@app/components/RichText/RichText'
import { useNewsletterCampaignControllerCreateMutation, useNewsletterCampaignControllerUpdateMutation } from '@app/services/api/newsletterCampaign/newsletterCampaign'
import { Button, Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
type EditSletterProps = {
  isEdit: boolean;
  open: boolean;
  onClose: () => void;
  record?: any;
  refetch: () => void;
};

const EditSletter : React.FC<EditSletterProps>= ({ isEdit ,open, onClose, record, refetch }) => {
  const [form] = Form.useForm()
  const [createCampaign] = useNewsletterCampaignControllerCreateMutation();
  const [updateCampaign] = useNewsletterCampaignControllerUpdateMutation();
   useEffect(() => {
    if (record) {
      form.setFieldsValue({
        title: record.title || "",
        headline: record.headline || "",
        description: record.description || ""
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);
  const handleCreate = async () => {
    try {
      console.log('Form values:', form.getFieldsValue())
      const values = await form.validateFields()
      if (isEdit && record) {
        await updateCampaign({
          id: record.id,
          body: {
            title: values.title,
            headline: values.headline,
            description: values.description
          }
        }).unwrap()
        toast.success('Campaign updated')
      }
      else{
        await createCampaign({
          title: values.title,
          headline: values.headline,
          description: values.description
        }).unwrap()
        toast.success('Campaign created')
      }
      form.resetFields()
      refetch()
      onClose()
    } catch (err) {
      toast.error('Failed to create campaign')
    }
  }
  return (
    <>
      <Modal
        title='Edit Newsletter Campaign'
        open={open}
        onCancel={onClose}
        footer={[
          <Button key='cancel'>Cancel</Button>,
          <Button key='save' type='primary' onClick={handleCreate}>
            Save
          </Button>
        ]}
        width={700}
      >
        <div className='max-h-[60vh] overflow-y-auto'>
          <Form form={form} layout='horizontal' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className='max-w-full'>
            <Form.Item
              name='title'
              label='Title'
              rules={[
                { required: true, message: 'Title is required' },
                { min: 3, message: 'Title must be at least 3 characters' },
                { max: 128, message: 'Title must not exceed 128 characters' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='headline'
              label='Headline'
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value || value.length < 10) return Promise.reject('Headline must be at least 50 characters')
                    if (value.length > 510) return Promise.reject('Headline must not exceed 510 characters')
                    return Promise.resolve()
                  }
                })
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='description' label='Description'>
              <RichTextEditor customClass='custom-editor' />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}

export default EditSletter
