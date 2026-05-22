import { useState } from 'react';
import { Input, Table, Popconfirm, Tag, Button } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import {
    useSearchCollectionsQuery,
    useDeleteCollectionMutation,
} from '@app/services/api/collection/collection';
import { Collection } from '@app/types/collection.types';
import TableActionButton from '@app/components/TableActionButton/TableActionButton';
import TableImage from '@app/components/TableImage/TableImage';
import { toast } from 'react-toastify';

const CollectionsPage = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data, isLoading, refetch } = useSearchCollectionsQuery(
        { search, pageNumber: page, pageSize },
        { refetchOnMountOrArgChange: true }
    );

    const [deleteCollection] = useDeleteCollectionMutation();

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteCollection(id).unwrap();
            toast.success('Collection deleted');
            refetch();
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'featuredImage',
            key: 'featuredImage',
            width: 80,
            render: (text: string) => <TableImage src={text} alt="collection" size={40} />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Owner',
            dataIndex: ['owner', 'name'],
            key: 'owner',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'PUBLISHED' ? 'green' : 'orange'}>{status}</Tag>
            ),
        },
        {
            title: 'Apps',
            dataIndex: 'appCount',
            key: 'appCount',
            width: 80,
            align: 'center' as const,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_: unknown, record: Collection) => {
                const isDeleting = deletingId === record.id;
                return (
                    <Popconfirm
                        title="Delete this collection?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ loading: isDeleting }}
                    >
                        <Button
                            type="text"
                            danger
                            icon={isDeleting ? <LoadingOutlined /> : undefined}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                );
            },
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg">Manage Collections</h2>
            </div>
            <div className="flex gap-4 mb-3">
                <Input
                    size="large"
                    placeholder="Search by title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onPressEnter={() => { setPage(1); refetch(); }}
                    prefix={<SearchOutlined className="text-secondary" />}
                    className="rounded-lg"
                />
                <TableActionButton
                    actionType="search"
                    onClick={() => { setPage(1); refetch(); }}
                >
                    Search
                </TableActionButton>
            </div>
            <Table
                dataSource={data?.data || []}
                columns={columns}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: page,
                    pageSize,
                    total: data?.totalCount || 0,
                    showSizeChanger: true,
                    onChange: (p, s) => { setPage(p); setPageSize(s); },
                }}
                scroll={{ x: 'max-content' }}
            />

        </div>
    );
};

export default CollectionsPage;