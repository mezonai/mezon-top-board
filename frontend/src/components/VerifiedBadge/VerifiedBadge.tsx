import { CheckCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { cn } from '@app/utils/cn';

interface VerifiedBadgeProps {
  className?: string;
  tooltipKey?: string; // i18n key
}

export const VerifiedBadge = ({ className, tooltipKey = 'common.verified' }: VerifiedBadgeProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t(tooltipKey)}>
      <CheckCircleFilled className={cn('text-primary', className)} />
    </Tooltip>
  );
};