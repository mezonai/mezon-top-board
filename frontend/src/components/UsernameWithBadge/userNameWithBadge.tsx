import { cn } from '@app/utils/cn';
import { VerifiedBadge } from "./VerifiedBadge.tsx";
import MtbTypography from '@app/mtb-ui/Typography/Typography';
import { MtbTypographyProps } from '@app/mtb-ui/Typography/Typography.types';

interface UserNameWithBadgeProps extends Omit<MtbTypographyProps, 'children' | 'label'> {
    name?: string | null;
    isVerified?: boolean;
    className?: string;
    nameClassName?: string;
    badgeClassName?: string;
}

export const UserNameWithBadge = ({
                                      name,
                                      isVerified,
                                      className,
                                      nameClassName,
                                      badgeClassName,
                                      variant = 'p',
                                      weight = 'normal',
                                      customClassName,
                                      ...typographyProps
                                  }: UserNameWithBadgeProps) => {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            <MtbTypography
                variant={variant}
                weight={weight}
                customClassName={cn(nameClassName, customClassName)}
                {...typographyProps}
            >
                {name || "unnamed"}
            </MtbTypography>
            {isVerified && <VerifiedBadge className={badgeClassName} />}
        </div>
    );
};