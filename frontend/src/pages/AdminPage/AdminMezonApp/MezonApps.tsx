import { SearchOutlined } from "@ant-design/icons";
import { useLazyMezonAppControllerListAdminMezonAppQuery, useMezonAppControllerDeleteMezonAppMutation } from "@app/services/api/mezonApp/mezonApp";
import { GetMezonAppDetailsResponse } from "@app/services/api/mezonApp/mezonApp.types";
import { RootState } from "@app/store";
import { useAppSelector } from "@app/store/hook";
import { getMezonInstallLink, mapStatusToColor, mapStatusToText } from "@app/utils/mezonApp";
import { Input, Popconfirm, Spin, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TableActionButton from "@app/components/TableActionButton/TableActionButton";
import TableImage from "@app/components/TableImage/TableImage";

const MezonApps = ({ onEdit }: { onEdit: (app: GetMezonAppDetailsResponse) => void }) => {
  const navigate = useNavigate()
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [listAdminMezonApp, { isLoading }] = useLazyMezonAppControllerListAdminMezonAppQuery();
  const dataAPI = useAppSelector((state: RootState) => state.mezonApp.mezonAppOfAdmin); // Get apps from Redux store
  const {
    totalCount,
    data: apps,
  } = dataAPI || { totalCount: 0, data: [] };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteMezonApp, { isLoading: isDeleting }] = useMezonAppControllerDeleteMezonAppMutation();
  const handleDelete = async (appId: string) => {
    try {
      await deleteMezonApp({ requestWithId: { id: appId } }).unwrap();
      toast.success("App deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete app");
    }
  };

  const fetchApps = async () => {
    listAdminMezonApp({
      search: searchQuery,
      pageSize: currentPageSize,
      pageNumber: currentPageNumber,
      sortField: "createdAt",
      sortOrder: "DESC",
    });
  }

  useEffect(() => {
    fetchApps();
  }, [currentPageSize, currentPageNumber]);

  const handleSearchSubmit = () => {
    setCurrentPageNumber(1); 
    fetchApps();
  }

  const columns = [
    {
      title: "Image",
      dataIndex: "featuredImage",
      key: "featuredImage",
      width: 80,
      render: (featuredImage: string, data: GetMezonAppDetailsResponse) => (
        <TableImage src={featuredImage} alt={data.name} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="break-words max-w-[80px] 2xl:max-w-[120px]">
          {text}
        </div>
      ),
      sorter: (a : GetMezonAppDetailsResponse, b : GetMezonAppDetailsResponse) => a.name.localeCompare(b.name),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (owner: { name: string }) => (
        <div className="line-clamp-5 break-words max-w-[80px] 2xl:max-w-[120px]">
          {owner.name}
        </div>
      ),
    },
    {
      title: "Try",
      dataIndex: "installLink",
      key: "installLink",
      render: (_: any, record: GetMezonAppDetailsResponse) => {
       const installLink = getMezonInstallLink(record.type, record.mezonAppId);
        return (
          <TableActionButton
            actionType="install"
            href={installLink}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!installLink}
          />
        );
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (<Tag color={mapStatusToColor(status)}>{mapStatusToText(status)}</Tag>)
    },
    {
      title: "Headline",
      dataIndex: "headline",
      key: "headline",
      render: (text: string) => (
        <div className="line-clamp-5 overflow-hidden text-ellipsis max-w-[300px] 2xl:max-w-[400px]">
          {text}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: GetMezonAppDetailsResponse) => (
        <div className="flex gap-2 align-center">
          <TableActionButton
            actionType="view"
            onClick={() => navigate(`/bot/${record.id}`)}
          />
          <TableActionButton
            actionType="edit"
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this app?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <TableActionButton
              actionType="delete"
              loading={isDeleting}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className='flex gap-4 mb-3'>
        <Input
          size="large"
          placeholder='Search by name or headline'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<SearchOutlined className="text-secondary" />}
          onPressEnter={handleSearchSubmit}
          className='rounded-lg'
        />
        <TableActionButton
          actionType="search"
          onClick={handleSearchSubmit}
        >
          Search
        </TableActionButton>
      </div>
      {
        isLoading ? (
          <Spin size="large" className="text-center mt-5" />
        ) : (
          <Table
            dataSource={apps}
            columns={columns}
            rowKey="id"
            pagination={
              {
                current: currentPageNumber,
                pageSize: currentPageSize,
                total: totalCount,
                showSizeChanger: true,
                pageSizeOptions: ["2", "10", "20", "50", "100"],
                showTotal: (total) => `Total ${total} items`,
                onChange: (page, pageSize) => {
                  setCurrentPageNumber(page);
                  setCurrentPageSize(pageSize || 10);
                },
              }
            }
            className='cursor-pointer'
          />
        )
      }
    </>
  );
};
export default MezonApps
