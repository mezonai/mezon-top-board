import { Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined, SearchOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';
import Button from '@app/mtb-ui/Button';
import { ReactNode } from 'react';

export type TableActionType = 'view' | 'edit' | 'delete' | 'install' | 'search' | 'add' | 'activate' | 'review';

interface TableActionButtonProps {
  actionType: TableActionType;
  onClick?: () => void;
  href?: string;
  loading?: boolean;
  disabled?: boolean;
  tooltipTitle?: string;
  icon?: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
  iconPosition?: 'start' | 'end';
  htmlType?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'middle' | 'large';
}

const actionConfigs = {
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

const TableActionButton = ({
  actionType,
  tooltipTitle,
  icon,
  className = '',
  children,
  iconPosition = 'start',
  size,
  ...props
}: TableActionButtonProps) => {
  const config = actionConfigs[actionType];
  const isPageLevel = actionType === 'search' || actionType === 'add';

  const buttonElement = (
    <Button
      variant={config.variant}
      color={config.color}
      icon={icon || config.icon}
      iconPosition={isPageLevel ? (iconPosition || 'end') : iconPosition}
      size={isPageLevel ? "large" : size}
      className={`!border-none !whitespace-normal !h-auto !min-h-[40px] !py-2 !px-4 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );

  if (!config.tooltip && !tooltipTitle) {
    return buttonElement;
  }

  return (
    <Tooltip title={tooltipTitle || config.tooltip}>
      {buttonElement}
    </Tooltip>
  );
};

export default TableActionButton;
