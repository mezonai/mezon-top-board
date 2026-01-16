import { Tooltip } from 'antd';
import Button from '@app/mtb-ui/Button';
import { ReactNode } from 'react';
import { actionConfigs } from './action.config';
import { cn } from '@app/utils/cn';

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
      className={cn(
        `!border-none !whitespace-normal !h-auto !min-h-[40px]`,
        isPageLevel ? '!min-w-28 !px-4' : '',
        className
      )}
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
