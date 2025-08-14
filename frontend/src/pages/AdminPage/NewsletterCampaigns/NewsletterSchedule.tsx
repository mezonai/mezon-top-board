import { useState } from 'react'
import { Button, Modal, Select, Radio, InputNumber } from 'antd'
import { useNewsletterScheduleControllerCreateMutation } from '@app/services/api/newsletterCampaign/newsletterCampaign'
import { toast } from 'react-toastify'

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${i.toString().padStart(2, '0')}:00`,
  value: i
}))

export default function NewsletterSchedule() {
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'fixed' | 'interval'>('fixed')
  const [selectedHours, setSelectedHours] = useState<number[]>([])
  const [intervalValue, setIntervalValue] = useState<number>(1)
  const [intervalUnit, setIntervalUnit] = useState<'hours' | 'minutes'>('hours')
  const [loading, setLoading] = useState(false)
  const [createSchedule] = useNewsletterScheduleControllerCreateMutation()
  const handleSave = async () => {
    if (mode === 'fixed' && selectedHours.length === 0) {
      toast.warning('Please select at least one fixed time!')
      return
    }
    if (mode === 'interval' && intervalValue <= 0) {
      toast.warning('Interval must be greater than 0!')
      return
    }

    try {
      setLoading(true)
      await createSchedule({
        mode,
        fixedHours: mode === 'fixed' ? selectedHours : undefined,
        interval: mode === 'interval' ? { value: intervalValue, unit: intervalUnit } : undefined
      })
      toast.success('Schedule saved successfully!')
      setVisible(false)
    } catch (err) {
      toast.error('Failed to save schedule!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button type='primary' onClick={() => setVisible(true)}>
        Set Newsletter Schedule
      </Button>

      <Modal
        title='Set Newsletter Schedule'
        open={visible}
        onOk={handleSave}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
      >
        <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)} style={{ marginBottom: 16 }}>
          <Radio value='fixed'>Fixed daily times</Radio>
          <Radio value='interval'>Repeat every X time</Radio>
        </Radio.Group>

        {mode === 'fixed' && (
          <Select
            mode='multiple'
            style={{ width: '100%' }}
            placeholder='Select fixed times'
            options={hours}
            value={selectedHours}
            onChange={(value) => setSelectedHours(value)}
          />
        )}

        {mode === 'interval' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <InputNumber min={1} value={intervalValue} onChange={(val) => setIntervalValue(val || 1)} />
            <Select
              value={intervalUnit}
              onChange={(val) => setIntervalUnit(val)}
              options={[
                { label: 'Hours', value: 'hours' },
                { label: 'Minutes', value: 'minutes' }
              ]}
            />
          </div>
        )}
      </Modal>
    </>
  )
}
