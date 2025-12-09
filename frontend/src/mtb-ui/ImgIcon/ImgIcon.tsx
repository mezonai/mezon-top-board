import { cn } from '@app/utils/cn'

export type ImgIconProps = {
    src: string;
    alt?: string;
    className?: string;
    width?: string | number;
    height?: string | number;
    square?: boolean;
    rounded?: boolean;
};

export const ImgIcon = (props: ImgIconProps) => {
    const {
        src,
        alt,
        className,
        width,
        height,
        square,
        rounded,
    } = props
    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width || 'auto',
        height: typeof height === 'number' ? `${height}px` : height || 'auto',
    }

    return (
        <div
            style={style}
            className={cn('overflow-hidden', square && 'aspect-square', rounded && 'rounded-full', className)}
        >
            <img
                src={src}
                alt={alt ?? ''}
                className={cn('w-full h-full object-cover')}
            />
        </div>
    )
}