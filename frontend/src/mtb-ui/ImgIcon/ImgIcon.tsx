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
    return (
        <div
            style={{ width: width || 'auto', height: height || 'auto' }}
            className={`overflow-hidden ${className} ${square ? 'aspect-square' : ''} ${rounded ? 'rounded-full' : ''}`}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover ${className}`}
            />
        </div>
    )
}