import { Modal, Tag, Divider, Spin, Typography, Descriptions } from 'antd'
import React from 'react'
import { formatDate } from '@app/utils/date'
import type { GetMezonAppDetailsResponse, AppVersion } from '@app/services/api/mezonApp/mezonApp'
import sampleBotImg from "@app/assets/images/avatar-bot-default.png";
import { getUrlMedia } from '@app/utils/stringHelper'

interface Props {
    open: boolean
    onClose: () => void
    appData?: GetMezonAppDetailsResponse | undefined
    latestVersion?: AppVersion
}

const { Title, Text, Paragraph } = Typography

const PreviewModal: React.FC<Props> = ({ open, onClose, appData, latestVersion }) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={720}
            centered
            title={appData ? 'App Details' : 'Loading...'}
            styles={{
                body: {
                    padding: '20px 24px',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }
            }}
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
                                src={appData.featuredImage ? getUrlMedia(appData.featuredImage) : sampleBotImg}
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

                        {appData.description
                            ? <div dangerouslySetInnerHTML={{ __html: appData.description }} />
                            : <Paragraph>No description</Paragraph>
                        }
                    </div>
                    <Divider />
                    <Descriptions
                        title="Latest version"
                        bordered size="small"
                        column={1}
                        labelStyle={{ backgroundColor: '#f3f5f7', color: '#374151', fontWeight: 700 }}
                        contentStyle={{ backgroundColor: '#ffffff', color: '#111827' }}
                    >
                        {latestVersion ? (
                            <>
                                <Descriptions.Item label="Version">
                                    {latestVersion.version ?? '0'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Submitted">
                                    {formatDate(appData.versions?.[0]?.updatedAt)}
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

export default PreviewModal