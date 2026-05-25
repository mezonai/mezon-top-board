import { useMemo } from 'react';
import { Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearchCollectionsQuery } from '@app/services/api/collection/collection';
import MtbTypography from '@app/mtb-ui/Typography/Typography';
import TableImage from '@app/components/TableImage/TableImage';
import { GlassCard } from '@app/components/GlassCard/GlassCard';

const CollectionsPage = () => {
    const { t } = useTranslation(['common']);
    const navigate = useNavigate();

    const { data, isLoading } = useSearchCollectionsQuery(
        { pageNumber: 1, pageSize: 100 },
        { refetchOnMountOrArgChange: true }
    );

    const collections = useMemo(() => data?.data ?? [], [data]);

    const renderCollectionContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center py-20">
                    <Spin size="large" />
                </div>
            );
        }

        if (collections.length === 0) {
            return <Empty description={t('profile.my_collections.empty')} />;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((col) => (
                    <GlassCard
                        key={col.id}
                        hoverEffect={true}
                        className="p-4 flex flex-col cursor-pointer"
                        onClick={() => navigate(`/collection/${col.id}`)}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                <TableImage src={col.featuredImage ?? undefined} alt="collection" size={48} />
                            </div>
                            <MtbTypography variant="h4" customClassName="truncate flex-1 !mb-0">
                                {col.title}
                            </MtbTypography>
                        </div>
                        <MtbTypography variant="p" weight="normal" customClassName="text-secondary text-xs mb-2">
                            {col.description || t('nav.collections_no_description')}
                        </MtbTypography>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-xs text-secondary">
                                {t('nav.collections_app_count', { count: col.apps?.length ?? 0 })}
                            </span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto pt-10 pb-10 px-6">
            <MtbTypography variant="h1" customClassName="mb-6">{t('nav.collections')}</MtbTypography>

            {renderCollectionContent()}
        </div>
    );
};

export default CollectionsPage;