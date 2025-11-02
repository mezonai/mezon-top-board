import { CiOutlined, DeleteOutlined, EditOutlined, LockOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import sampleBotImg from "@app/assets/images/avatar-bot-default.png";
import { AppStatus } from "@app/enums/AppStatus.enum";
import { GetMezonAppDetailsResponse, useLazyMezonAppControllerListAdminMezonAppQuery, useMezonAppControllerDeleteMezonAppMutation } from "@app/services/api/mezonApp/mezonApp";
import { useReviewHistoryControllerCreateAppReviewMutation } from "@app/services/api/reviewHistory/reviewHistory";
import { RootState } from "@app/store";
import { useAppSelector } from "@app/store/hook";
import { getMezonInstallLink, mapStatusToColor, mapStatusToText } from "@app/utils/mezonApp";
import { getUrlMedia } from "@app/utils/stringHelper";
import { Button, Input, Modal, Popconfirm, Spin, Table, Tag, Tooltip } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MezonApps = ({ onEdit }: { onEdit: (app: GetMezonAppDetailsResponse) => void }) => {
  const navigate = useNavigate()
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRemark, setReviewRemark] = useState("");
  const [reviewingAppId, setReviewingAppId] = useState<string | null>(null);

  const [listAdminMezonApp, { isLoading }] = useLazyMezonAppControllerListAdminMezonAppQuery();
  const dataAPI = useAppSelector((state: RootState) => state.mezonApp.mezonAppOfAdmin); // Get apps from Redux store
  const {
    totalCount,
    data: apps,
  } = dataAPI || { totalCount: 0, data: [] };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteMezonApp, { isLoading: isDeleting }] = useMezonAppControllerDeleteMezonAppMutation();
  const [
    createReviewHistory,
    {
      isLoading: isCreatingReviewHistory,
      error: createReviewHistoryError,
      isSuccess: isReviewHistoryCreated,
    }
  ] = useReviewHistoryControllerCreateAppReviewMutation();
  const handleDelete = async (appId: string) => {
    try {
      await deleteMezonApp({ requestWithId: { id: appId } }).unwrap();
      toast.success("App deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete app");
    }
  };

  const reviewApp = async (status: AppStatus) => {
    try {
      const isApproved = status === AppStatus.APPROVED;
      if (reviewingAppId === null) {
        toast.error("Invalid app id");
        return
      }

      await createReviewHistory({
        createAppReviewRequest: {
          appId: reviewingAppId || "",
          isApproved: isApproved,
          remark: reviewRemark,
        },
      }).unwrap();

      await fetchApps();

      toast.success(`App ${isApproved ? "approved" : "rejected"} successfully`);
      setShowReviewModal(false);
      setReviewingAppId(null);
      setReviewRemark("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve app");
    }
  };

  const onReviewStart = async (app: GetMezonAppDetailsResponse) => {
    setShowReviewModal(true);
    setReviewingAppId(app.id);
  }

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
      render: (featuredImage: string, data: GetMezonAppDetailsResponse) => (
        <img
          src={
            featuredImage
              ? getUrlMedia(featuredImage)
              : sampleBotImg
          }
          alt={data.name}
          style={{ width: 100 }} />
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
          <Tooltip title="Try Install">
            <Button
              type="primary"
              color="cyan"
              variant="outlined"
              href={installLink}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!installLink}
            >
              <CiOutlined />
            </Button>
          </Tooltip>
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
        <div className="flex gap-2">
          <Tooltip title='View'>
            <Button
              color='cyan'
              variant='outlined'
              icon={<EyeOutlined />}
              onClick={() => navigate(`/bot/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this app?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="primary" color="danger" icon={<DeleteOutlined />} danger loading={isDeleting} />
            </Tooltip>
          </Popconfirm>
          {
            (record.hasNewUpdate || record.status === 0) && (
              <Tooltip title="Review app">
                <Button color="cyan" variant="outlined" icon={<LockOutlined />} onClick={() => onReviewStart(record)} />
              </Tooltip>
            )
          }
        </div>
      ),
    },
  ];

  return (
    <>
      <div className='flex gap-4 mb-3'>
        <Input
          placeholder='Search by name or headline'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          onPressEnter={handleSearchSubmit}
          className='w-full rounded-[8px] h-[40px]'
        />
        <Button className="w-50" size="large"
          type='primary' 
          onClick={handleSearchSubmit}
          icon={<SearchOutlined />}
        >
          Search
        </Button>
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

      <Modal
        title="Review App"
        open={showReviewModal}
        onCancel={() => {
          setShowReviewModal(false);
          setReviewingAppId(null);
          setReviewRemark("");
        }}
        footer={[
          <Button type="primary" onClick={() => {
            if (reviewingAppId) {
              reviewApp(AppStatus.APPROVED);
            }
          }}>
            Approve
          </Button>,
          <Button type="primary" danger onClick={() => {
            if (reviewingAppId) {
              reviewApp(AppStatus.REJECTED);
            }
          }}>
            Reject
          </Button>,
        ]}
      >
        {isCreatingReviewHistory && <Spin size="large" />}
        <Input.TextArea
          placeholder="Remark"
          value={reviewRemark}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReviewRemark(e.target.value)}
        />
      </Modal>
    </>
  );
};
export default MezonApps
