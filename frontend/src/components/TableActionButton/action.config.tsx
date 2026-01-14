import { EyeOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined, SearchOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';


export const actionConfigs = {
  view: {
    icon: <EyeOutlined style={{ fontSize: 18 }} />,
    color: 'default',
    tooltip: 'View',
    variant: 'text',
  },
  edit: {
    icon: <EditOutlined style={{ fontSize: 18 }} />,
    color: 'blue',
    tooltip: 'Edit',
    variant: 'text',
  },
  delete: {
    icon: <DeleteOutlined style={{ fontSize: 18 }} />,
    color: 'danger',
    tooltip: 'Delete',
    variant: 'text',
  },
  install: {
    icon: <DownloadOutlined style={{ fontSize: 18 }} />,
    color: 'cyan',
    tooltip: 'Try Install',
    variant: 'text',
  },
  search: {
    icon: <SearchOutlined style={{ fontSize: 18 }} />,
    color: 'primary',
    tooltip: '',
    variant: 'solid',
  },
  add: {
    icon: <PlusOutlined style={{ fontSize: 18 }} />,
    color: 'primary',
    tooltip: '',
    variant: 'solid',
  },
  activate: {
    icon: <UnlockOutlined style={{ fontSize: 18 }} />,
    color: 'green',
    tooltip: 'Activate',
    variant: 'text',
  },
  review: {
    icon: <LockOutlined style={{ fontSize: 18 }} />,
    color: 'cyan',
    tooltip: 'Review',
    variant: 'text',
  },
};