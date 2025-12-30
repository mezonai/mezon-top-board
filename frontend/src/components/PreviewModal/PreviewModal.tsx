import { Modal, Tag, Divider, Spin, Typography, Descriptions } from 'antd'
import React from 'react'
import { formatDate } from '@app/utils/date'
import { AppVersionDetailsDto, GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import sampleBotImg from "@app/assets/images/avatar-bot-default.png";
import { getUrlMedia, uuidToNumber } from '@app/utils/stringHelper'
import { randomColor, getMezonInstallLink } from '@app/utils/mezonApp'
import { AppStatus } from '@app/enums/AppStatus.enum';
import TagPill from '@app/components/TagPill/TagPill';

interface Props {
    open: boolean
    onClose: () => void
    appData?: Partial<GetMezonAppDetailsResponse> | undefined
    latestVersion?: AppVersionDetailsDto
}

const { Title, Text, Paragraph } = Typography

const PreviewModal: React.FC<Props> = ({ open, onClose, appData, latestVersion }) => {
    const renderStatusTag = (status?: AppStatus) => {
        if (status === null || status === undefined) return '-'
        let color: string | undefined = undefined
        let label = AppStatus[status] ?? String(status)
        switch (status) {
            case AppStatus.PUBLISHED:
                color = 'green'
                label = 'Published'
                break
            case AppStatus.APPROVED:
                color = 'blue'
                label = 'Approved'
                break
            case AppStatus.PENDING:
                color = 'orange'
                label = 'Pending'
                break
            case AppStatus.REJECTED:
                color = 'red'
                label = 'Rejected'
                break
            default:
                color = undefined
        }
        return <Tag color={color}>{label}</Tag>
    }
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
                                src={latestVersion?.featuredImage ? getUrlMedia(latestVersion.featuredImage) : sampleBotImg}
                                alt={latestVersion?.name}
                                className='w-20 h-20 md:w-24 md:h-24 object-cover rounded-md mx-auto md:mx-0'
                            />

                            <div className='flex-1'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>{latestVersion?.name}</Title>
                                        <div className='mt-1'>
                                            <Text type='secondary' className='block md:inline'>{latestVersion?.headline}</Text>
                                            <div className='mt-1'>
                                                <Text type='secondary' style={{ fontSize: 12 }}>
                                                    Owner: {appData.owner?.name || '—'}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-start gap-2 order-first md:order-none md:self-start'>
                                        <TagPill value={appData.type} />
                                        <TagPill value={latestVersion?.pricingTag} />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {latestVersion?.description
                            ? <div dangerouslySetInnerHTML={{ __html: latestVersion.description }} />
                            : <Paragraph>No description</Paragraph>
                        }

                        <div className='flex flex-wrap gap-2'>
                            {latestVersion?.tags?.map((tag) => (
                                <Tag key={tag.id} color={randomColor('normal', uuidToNumber(tag.id))}>
                                    {tag.name}
                                </Tag>
                            ))}
                        </div>
                    </div>
                    <Divider />
                    <Descriptions
                        title="Latest version"
                        bordered size="small"
                        column={1}
                        labelStyle={{ backgroundColor: 'var(--bg-container-secondary)', color: 'var(--text-primary)', fontWeight: 700 }}
                        contentStyle={{ backgroundColor: 'var(--bg-container)', color: 'var(--text-primary)' }}
                    >
                        {latestVersion ? (
                            <>
                                <Descriptions.Item label="Version">
                                    {latestVersion.version ?? '0'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    {renderStatusTag(latestVersion.status)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Auto Publish">
                                    {latestVersion.isAutoPublished ? 'Yes' : 'No'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Prefix">
                                    {latestVersion.prefix ?? '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Submitted">
                                    {formatDate(latestVersion.updatedAt)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Support URL">
                                    {latestVersion.supportUrl ? (
                                        <a href={latestVersion.supportUrl} target="_blank" rel="noreferrer">
                                            {latestVersion.supportUrl}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Price">
                                    {latestVersion.price ?? 0}
                                </Descriptions.Item>
                                <Descriptions.Item label="App ID">
                                    {appData.mezonAppId || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Install Link">
                                    {appData.mezonAppId ? (
                                        <a
                                            href={getMezonInstallLink(appData.type, appData.mezonAppId)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {getMezonInstallLink(appData.type, appData.mezonAppId)}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Change Log">
                                    <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                                        {latestVersion.changelog || '-'}
                                    </Paragraph>
                                </Descriptions.Item>
                                <Descriptions.Item label="Note">
                                    <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                                        {latestVersion.remark || '-'}
                                    </Paragraph>
                                </Descriptions.Item>
                            </>
                        ) : (
                            <Descriptions.Item label="Status">
                                <Text type="secondary">No versions available</Text>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                    <Divider />
                    <div>
                        <Title level={5} style={{ marginTop: 0 }}>Social Links</Title>
                        {(latestVersion?.socialLinks && latestVersion.socialLinks.length > 0) ? (
                            <div className='flex flex-col gap-2'>
                                {latestVersion.socialLinks.map((link) => (
                                    <div key={link.id} className='flex items-center gap-2 text-sm'>
                                        {link.type?.icon && (
                                            <img src={getUrlMedia(link.type.icon)} alt={link.type.name} className='w-4 h-4' />
                                        )}
                                        <span className='font-medium'>{link.type?.name || 'Link'}:</span>
                                        <a
                                            href={(link.type?.prefixUrl ?? '') + (link.url ?? '')}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='text-blue-600 hover:underline'
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Text type='secondary'>No social links</Text>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    )
}

export default PreviewModal