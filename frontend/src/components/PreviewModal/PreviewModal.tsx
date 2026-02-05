import { Modal, Tag, Divider, Spin, Typography, Descriptions } from 'antd'
import React, { useMemo, useState } from 'react'
import { formatDate } from '@app/utils/date'
import { AppVersionDetailsDto, GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import sampleBotImg from "@app/assets/images/avatar-bot-default.png";
import { getUrlMedia } from '@app/utils/stringHelper'
import { getMezonInstallLink } from '@app/utils/mezonApp'
import TagPill from '@app/components/TagPill/TagPill';
import { useTranslation } from 'react-i18next';
import BotStatusBadge from '../BotStatusBadge/BotStatusBadge';
import { AppLanguage } from '@app/enums/appLanguage.enum';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useAppTranslation } from '@app/hook/useAppTranslation';

interface Props {
    open: boolean
    onClose: () => void
    appData?: Partial<GetMezonAppDetailsResponse> | undefined
    latestVersion?: AppVersionDetailsDto
}

const { Title, Text, Paragraph } = Typography

const PreviewModal: React.FC<Props> = ({ open, onClose, appData, latestVersion }) => {
    const { t } = useTranslation(['components'])
    const [previewLang, setPreviewLang] = useState<AppLanguage>(AppLanguage.EN);
    const translationSource = useMemo(() => ({
        defaultLanguage: latestVersion?.defaultLanguage || appData?.defaultLanguage,
        appTranslations: latestVersion?.appTranslations
    }), [latestVersion, appData]);
    const { name, headline, description } = useAppTranslation(translationSource, previewLang);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={720}
            centered
            title={appData ? t('component.preview_modal.title') : t('component.preview_modal.loading')}
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
                    <div className="flex justify-end mb-4">
                        <LanguageSelector 
                            value={previewLang} 
                            onChange={setPreviewLang} 
                            defaultLanguage={translationSource.defaultLanguage}
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className='flex items-start gap-4'>
                            <img
                                src={latestVersion?.featuredImage ? getUrlMedia(latestVersion.featuredImage) : sampleBotImg}
                                alt={name}
                                className='w-20 h-20 md:w-24 md:h-24 object-cover rounded-md mx-auto md:mx-0'
                            />

                            <div className='flex-1'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>{name}</Title>
                                        <div className='mt-1'>
                                            <Text type='secondary' className='block md:inline'>{headline}</Text>
                                            <div className='mt-1'>
                                                <Text type='secondary' style={{ fontSize: 12 }}>
                                                    {t('component.preview_modal.owner_label', { name: appData.owner?.name || '—' })}
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

                        {description
                            ? <div dangerouslySetInnerHTML={{ __html: description }} />
                            : <Paragraph>{t('component.preview_modal.no_description')}</Paragraph>
                        }

                        <div className='flex flex-wrap gap-2'>
                            {latestVersion?.tags?.map((tag) => (
                                <Tag key={tag.id} color={tag.color} variant='outlined'>{tag.name}</Tag>
                            ))}
                        </div>
                    </div>
                    <Divider />
                    <Descriptions
                        title={t('component.preview_modal.latest_version_title')}
                        bordered size="small"
                        column={1}
                        styles={{
                            label: { backgroundColor: 'var(--bg-container-secondary)', color: 'var(--text-primary)', fontWeight: 700 },
                            content: { backgroundColor: 'var(--bg-container)', color: 'var(--text-primary)' }
                        }}
                    >
                        {latestVersion ? (
                            <>
                                <Descriptions.Item label={t('component.preview_modal.version_label')}>
                                    {latestVersion.version ?? '0'}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('component.preview_modal.status_label')}>
                                    <BotStatusBadge status={latestVersion.status} />
                                </Descriptions.Item>
                                <Descriptions.Item label={t('component.preview_modal.auto_publish_label')}>
                                    {latestVersion.isAutoPublished ? t('component.preview_modal.yes') : t('component.preview_modal.no')}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('component.preview_modal.prefix_label')}>
                                    {latestVersion.prefix ?? '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('component.preview_modal.submitted_label')}>
                                    {formatDate(latestVersion.updatedAt)}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('component.preview_modal.support_url_label')}>
                                    {latestVersion.supportUrl ? (
                                        <a href={latestVersion.supportUrl} target="_blank" rel="noreferrer">
                                            {latestVersion.supportUrl}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('component.preview_modal.price_label')}>
                                    {latestVersion.price ?? 0}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('component.preview_modal.app_id_label')}>
                                    {appData.mezonAppId || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('component.preview_modal.install_link_label')}>
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
                                <Descriptions.Item label={t('component.preview_modal.changelog_label')}>
                                    <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                                        {latestVersion.changelog || '-'}
                                    </Paragraph>
                                </Descriptions.Item>
                            </>
                        ) : (
                            <Descriptions.Item label={t('component.preview_modal.status_label')}>
                                <Text type="secondary">{t('component.preview_modal.no_versions')}</Text>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                    <Divider />
                    <div>
                        <Title level={5} style={{ marginTop: 0 }}>{t('component.preview_modal.social_links_title')}</Title>
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
                            <Text type='secondary'>{t('component.preview_modal.no_social_links')}</Text>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    )
}

export default PreviewModal