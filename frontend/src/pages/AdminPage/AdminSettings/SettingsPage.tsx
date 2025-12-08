import { Card, Form, Switch, Space } from 'antd'
import { BulbOutlined, MoonOutlined } from '@ant-design/icons'
import { useTheme } from '@app/hook/useTheme'

const SettingsPage = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className='p-4'>
      <h2 className='text-lg font-semibold mb-4' style={{ color: 'var(--text-primary)' }}>
        Settings
      </h2>

      <Card
        title="Appearance"
        style={{
          background: 'var(--bg-container)',
          borderColor: 'var(--border-color)'
        }}
        headStyle={{
          color: 'var(--text-primary)',
          borderBottomColor: 'var(--border-color)'
        }}
        bodyStyle={{
          color: 'var(--text-primary)'
        }}
      >
        <Form layout="horizontal">
          <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Theme Mode</span>}>
            <Space align="center" size="large">
              <Switch
                checked={theme === 'dark'}
                onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<BulbOutlined />}
              />
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SettingsPage
