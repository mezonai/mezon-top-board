import sampleBotImg from "@app/assets/images/avatar-bot-default.png";
import { getUrlMedia } from "@app/utils/stringHelper";

interface TableImageProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

const TableImage = ({ 
  src, 
  alt = "image", 
  size = 50, 
  className = "" 
}: TableImageProps) => {
  const imageUrl = src ? getUrlMedia(src) : sampleBotImg;

  return (
    <img
      src={imageUrl}
      alt={alt}
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'contain', 
        display: 'block', 
        margin: '0 auto',
        borderRadius: '4px'
      }}
      className={className}
    />
  );
};

export default TableImage;
