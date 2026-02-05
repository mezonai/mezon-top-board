import { SearchOutlined } from "@ant-design/icons";
import { useLazyMezonAppControllerListAdminMezonAppQuery, useMezonAppControllerDeleteMezonAppMutation } from "@app/services/api/mezonApp/mezonApp";
import { GetMezonAppDetailsResponse } from "@app/services/api/mezonApp/mezonApp.types";
import { RootState } from "@app/store";
import { useAppSelector } from "@app/store/hook";
import { Input, Popconfirm, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TableActionButton from "@app/components/TableActionButton/TableActionButton";
import TableImage from "@app/components/TableImage/TableImage";
import BotStatusBadge from "@app/components/BotStatusBadge/BotStatusBadge";
import { useTranslation } from "react-i18next";
import { getAppTranslation } from "@app/hook/useAppTranslation";

const MezonApps = ({ onEdit }: { onEdit: (app: GetMezonAppDetailsResponse) => void }) => {
  const { i18n } = useTranslation();
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
      fetchApps();
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
      render: (featuredImage: string, data: GetMezonAppDetailsResponse) => {
        const { name } = getAppTranslation(data, i18n.language);
        return <TableImage src={featuredImage} alt={name} />
      },
    },
    {
      title: "Name",
      key: "name",
      render: (_: any, record: GetMezonAppDetailsResponse) => {
        const { name } = getAppTranslation(record, i18n.language);
        return (
          <div className="break-words max-w-[80px] 2xl:max-w-[120px]">
            {name}
          </div>
        );
      },
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <div className="flex flex-col gap-1 items-start">
          <BotStatusBadge status={status} variant="tag" />
        </div>
      )
    },
    {
      title: "Headline",
      key: "headline",
      render: (_: any, record: GetMezonAppDetailsResponse) => {
        const { headline } = getAppTranslation(record, i18n.language);
        return (
          <div className="line-clamp-5 overflow-hidden text-ellipsis max-w-[300px] 2xl:max-w-[400px]">
            {headline}
          </div>
        );
      },
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
            <Space>
              <TableActionButton
                actionType="delete"
                loading={isDeleting}
              />
            </Space>
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
