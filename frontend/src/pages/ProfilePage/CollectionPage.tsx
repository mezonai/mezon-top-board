import { useState } from 'react';
import { Divider, Empty, Spin, Popconfirm, Button as AntButton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@app/hook/useAuth';
import { useGetMyCollectionsQuery, useCreateCollectionMutation, useUpdateCollectionMutation, useDeleteCollectionMutation } from '@app/services/api/collection/collection';
import { Collection } from '@app/types/collection.types';
import MtbTypography from '@app/mtb-ui/Typography/Typography';
import MtbButton from '@app/mtb-ui/Button';
import TableImage from '@app/components/TableImage/TableImage';
import { toast } from 'react-toastify';
import CollectionModal from '@app/pages/AdminPage/AdminManageCollections/CollectionModal';
import { CardInfo } from './components';
import { GlassCard } from '@app/components/GlassCard/GlassCard';
import { useAppSelector } from '@app/store/hook';
import { RootState } from '@app/store';
import { IUserStore } from '@app/store/user';

const CollectionsPage = () => {
    const { t } = useTranslation(['profile_page', 'common']);
    const navigate = useNavigate();
    const { isLogin } = useAuth();
    const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    const { data, isLoading, refetch } = useGetMyCollectionsQuery(
        { pageNumber: 1, pageSize: 100 },
        { skip: !isLogin }
    );

    const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
    const [updateCollection, { isLoading: isUpdating }] = useUpdateCollectionMutation();
    const [deleteCollection] = useDeleteCollectionMutation();

    const collections = data?.data ?? [];

    const handleCreateOrUpdate = async (values: any) => {
        try {
            if (editingCollection) {
                await updateCollection({ id: editingCollection.id, ...values }).unwrap();
                toast.success('Collection updated');
            } else {
                await createCollection(values).unwrap();
                toast.success('Collection created');
            }
            setIsModalOpen(false);
            setEditingCollection(null);
            refetch();
        } catch {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCollection(id).unwrap();
            toast.success('Deleted');
            refetch();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const openCreate = () => {
        setEditingCollection(null);
        setIsModalOpen(true);
    };

    const openEdit = (col: Collection) => {
        setEditingCollection(col);
        setIsModalOpen(true);
    };

    return (
        <div className="pt-8 pb-12 w-[85%] mx-auto">
            <MtbTypography variant="h1">{t('profile.my_collections.title')}</MtbTypography>
            <Divider className="bg-border" />
            <div className="flex justify-between gap-10 max-lg:flex-col">
                <div className="w-1/3 max-lg:w-full">
                    <CardInfo userInfo={userInfo} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <MtbTypography variant="h2">{t('profile.my_collections.subtitle')}</MtbTypography>
                        <MtbButton color="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            {t('profile.my_collections.create')}
                        </MtbButton>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Spin size="large" />
                        </div>
                    ) : collections.length === 0 ? (
                        <Empty description={t('profile.my_collections.empty')} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collections.map((col) => (
                                <GlassCard  key={col.id} hoverEffect={true}  className="p-4 flex flex-col cursor-pointer"  onClick={() => navigate(`/collection/${col.id}`)} >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                            <TableImage src={col.featuredImage ?? undefined} alt="collection" size={48} />
                                        </div>
                                        <MtbTypography variant="h4" customClassName="truncate flex-1 !mb-0">
                                            {col.title}
                                        </MtbTypography>
                                    </div>
                                    <MtbTypography variant="p" weight="normal" customClassName="text-secondary text-xs mb-2">
                                        {col.description || t('profile.my_collections.no_description')}
                                    </MtbTypography>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs text-secondary">
                                          {t('profile.my_collections.app_count', { count: col.collectionApps?.length ?? 0 })}
                                        </span>
                                        <div className="flex gap-2">
                                            <AntButton
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEdit(col);
                                                }}
                                            />
                                            <Popconfirm
                                                title="Delete this collection?"
                                                onConfirm={() => handleDelete(col.id)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <AntButton
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </Popconfirm>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CollectionModal
                open={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingCollection(null); }}
                onSubmit={handleCreateOrUpdate}
                initialValues={editingCollection}
                isLoading={isCreating || isUpdating}
                ownerId={userInfo?.id || undefined}
            />
        </div>
    );
};

export default CollectionsPage;
