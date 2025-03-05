import { useMezonAppControllerCreateMezonAppMutation } from "@app/services/api/mezonApp/mezonApp";
import { Button, Form, Input, Modal, Switch } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

const CreateAppModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [createMezonApp, { isLoading }] = useMezonAppControllerCreateMezonAppMutation();

  const handleOpen = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await createMezonApp({ createMezonAppRequest: values }).unwrap();
      toast.success("App created successfully");
      setIsModalVisible(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create app");
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleOpen}>Create App</Button>

      <Modal
        title="Create New App"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={isLoading} onClick={handleSave}>Save</Button>,
        ]}
        width={700}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          <Form form={form} layout="horizontal" labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }} className="max-w-full">
            <Form.Item name="name" label="App Name" rules={[{ required: true, message: "App Name is required" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="headline" label="Headline">
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="installLink" label="Install Link" rules={[
              { type: "url", message: "Please enter a valid URL" }
            ]} validateTrigger="onBlur">
              <Input placeholder="https://example.com" />
            </Form.Item>
            <Form.Item name="ownerId" label="Owner ID" rules={[{ required: true, message: "Owner ID is required" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="isAutoPublished" label="Is Auto Published?" valuePropName="checked" >
              <Switch className="ml-2"
              />
            </Form.Item>
            <Form.Item name="prefix" label="Prefix">
              <Input />
            </Form.Item>
            <Form.Item name="supportUrl" label="Support Url" rules={[
              { type: "url", message: "Please enter a valid URL" }, // Built-in URL validator
            ]} validateTrigger="onBlur">
              <Input placeholder="https://support.example.com" />
            </Form.Item>
            <Form.Item name="remark" label="Remark">
              <Input />
            </Form.Item>
            <Form.Item name="featuredImage" label="Featured Image">
              <Input placeholder="Paste Image URL" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default CreateAppModal