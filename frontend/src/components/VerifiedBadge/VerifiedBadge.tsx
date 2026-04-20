import { CheckCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { cn } from '@app/utils/cn';

interface VerifiedBadgeProps {
  className?: string;
}

export const VerifiedBadge = ({ className}: VerifiedBadgeProps) => {
  return (
    <Tooltip title='verified'>
      <CheckCircleFilled className={cn('text-primary', className)} />
    </Tooltip>
  );
};