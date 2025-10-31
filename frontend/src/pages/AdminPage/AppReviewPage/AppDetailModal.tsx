import { Modal, Tag, Divider, Spin, Typography, Descriptions } from 'antd'
import React from 'react'
import { GetMezonAppDetailsResponse, mockAppVersions } from './mockData'
import { formatDate } from '@app/utils/date'

interface Props {
    open: boolean
    onClose: () => void
    appId?: string
    appData?: GetMezonAppDetailsResponse | undefined
}

const { Title, Text, Paragraph } = Typography

const AppDetailModal: React.FC<Props> = ({ open, onClose, appId, appData }) => {
    const latestVersion = React.useMemo(() => {
        if (!appId) return undefined
        const versions = mockAppVersions.filter(v => v.appId === appId && !v.deletedAt)
        versions.sort((a, b) => (b.version || 0) - (a.version || 0))
        return versions[0]
    }, [appId])

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={720}
            centered
            title={appData ? 'App Details' : 'Loading...'}
            bodyStyle={{ padding: '20px 24px' }}
        >
            {!appData ? (
                <div className='text-center py-2'>
                    <Spin size="large" />
                </div>
            ) : (
                <div>
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-start gap-4'>
                            <img
                                src={appData.featuredImage || '/assets/imgs/default.png'}
                                alt={appData.name}
                                className='w-20 h-20 md:w-24 md:h-24 object-cover rounded-md mx-auto md:mx-0'
                            />

                            <div className='flex-1'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>{appData.name}</Title>
                                        <div className='mt-1'>
                                            <Text type='secondary' className='block md:inline'>{appData.headline}</Text>
                                            <div className='mt-1'>
                                                <Text type='secondary' style={{ fontSize: 12 }}>
                                                    Owner: {appData.owner?.name || '—'}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <Tag color='blue'>{appData.type || '—'}</Tag>
                                        <Tag color="success">{appData.pricingTag || '-'}</Tag>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Paragraph className='mt-0' style={{ fontSize: 14 }}>
                                {appData.description}
                            </Paragraph>
                        </div>
                    </div>

                    <Divider />

                    <Descriptions title="Latest version" bordered size="small" column={1}>
                        {latestVersion ? (
                            <>
                                <Descriptions.Item label="Version">
                                    {latestVersion.version ?? '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Submitted">
                                    {formatDate(latestVersion.createdAt)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Change Log">
                                    <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                                        {latestVersion.changelog || '-'}
                                    </Paragraph>
                                </Descriptions.Item>
                            </>
                        ) : (
                            <Descriptions.Item label="Status">
                                <Text type="secondary">No versions available</Text>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </div>
            )}
        </Modal>
    )
}

export default AppDetailModal