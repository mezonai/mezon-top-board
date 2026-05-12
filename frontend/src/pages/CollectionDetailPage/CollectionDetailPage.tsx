import {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useAppSelector } from '@app/store/hook';
import { RootState } from '@app/store';
import { IUserStore } from '@app/store/user';
import { useGetCollectionQuery, useUpdateCollectionMutation } from '@app/services/api/collection/collection';
import { Collection } from '@app/types/collection.types';
import MtbTypography from '@app/mtb-ui/Typography/Typography';
import MtbButton from '@app/mtb-ui/Button';
import TableImage from '@app/components/TableImage/TableImage';
import BotListItem from '@app/components/BotListItem/BotListItem';
import CollectionModal from '@app/pages/AdminPage/AdminManageCollections/CollectionModal';
import { GlassCard } from '@app/components/GlassCard/GlassCard';
import { toast } from 'react-toastify';
import { Role } from '@app/enums/role.enum';

const CollectionDetailPage = () => {
    const { collectionId } = useParams<{ collectionId: string }>();
    const navigate = useNavigate();
    const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data, isLoading, error, refetch } = useGetCollectionQuery(collectionId!, {
        skip: !collectionId,
        refetchOnMountOrArgChange: true,
    });

    const [updateCollection, { isLoading: isUpdating }] = useUpdateCollectionMutation();

    const collection: Collection | undefined = data?.data;

    useEffect(() => {
        if (collection?.title) {
            document.title = `${collection.title} - Collection - Mezon Top Board`;
        }
        return () => {
            document.title = 'Mezon Top Board';
        };
    }, [collection?.title]);

    const isOwner = collection?.ownerId === userInfo?.id;
    const isAdmin = userInfo?.role === Role.ADMIN;
    const canEdit = isOwner || isAdmin;

    // Redirect to 404 if not found or private and user not allowed
    if (!isLoading && (error || !collection)) {
        navigate('/404', { replace: true });
        return null;
    }

    if (!isLoading && collection && collection.status === 'PRIVATE' && !canEdit) {
        navigate('/404', { replace: true });
        return null;
    }

    const handleEditSubmit = async (values: any) => {
        try {
            await updateCollection({ id: collection!.id, ...values }).unwrap();
            toast.success('Collection updated');
            setIsEditModalOpen(false);
            refetch();
        } catch {
            toast.error('Failed to update collection');
        }
    };

    return (
        <div className="max-w-6xl mx-auto pt-10 pb-10 px-6">
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Spin size="large" />
                </div>
            ) : collection ? (
                <>
                    {/* Header */}
                    <GlassCard className="mb-8 p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                                <TableImage src={collection.featuredImage ?? undefined} alt="collection" size={160} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <MtbTypography variant="h1" customClassName="!mb-1">
                                            {collection.title}
                                        </MtbTypography>
                                        <MtbTypography variant="p" weight="normal" customClassName="text-secondary mb-4">
                                            by {collection.owner?.name || 'Unknown'}
                                        </MtbTypography>
                                        {collection.description && (
                                            <MtbTypography variant="p" weight="normal" customClassName="text-secondary whitespace-pre-wrap">
                                                {collection.description}
                                            </MtbTypography>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        collection.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {collection.status}
                    </span>
                                        {canEdit && (
                                            <MtbButton
                                                icon={<EditOutlined />}
                                                variant="outlined"
                                                onClick={() => setIsEditModalOpen(true)}
                                            >
                                                Edit
                                            </MtbButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Apps list */}
                    <div>
                        <MtbTypography variant="h2" customClassName="mb-4">
                            Apps in this collection ({collection.collectionApps?.length ?? 0})
                        </MtbTypography>
                        <div className="flex flex-col gap-4">
                            {collection.collectionApps?.map((ca) => (
                                <BotListItem key={ca.appId} data={ca.app} readonly />
                            ))}
                        </div>
                    </div>

                    {/* Edit modal */}
                    <CollectionModal
                        open={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSubmit={handleEditSubmit}
                        initialValues={collection}
                        isLoading={isUpdating}
                        ownerId={isAdmin ? undefined : collection.ownerId} // admin can add any app, owner only their own
                    />
                </>
            ) : null}
        </div>
    );
};

export default CollectionDetailPage;