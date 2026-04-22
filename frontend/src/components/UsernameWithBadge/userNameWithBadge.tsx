import { cn } from '@app/utils/cn';
import {VerifiedBadge} from "./VerifiedBadge.tsx";

interface UserNameWithBadgeProps {
    name: React.ReactNode;
    isVerified?: boolean;
    className?: string;
    nameClassName?: string;
    badgeClassName?: string;
    as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p';
}

export const UserNameWithBadge = ({
    name,
    isVerified,
    className,
    nameClassName,
    badgeClassName,
    as: Component = 'span'
}: UserNameWithBadgeProps) => {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            <Component className={nameClassName}>{name}</Component>
            {isVerified && <VerifiedBadge className={badgeClassName} />}
        </div>
    );
};