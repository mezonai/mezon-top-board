import { Tag } from 'antd';
import { TagInMezonAppDetailResponse } from '@app/services/api/mezonApp/mezonApp.types';
import { lightenHex } from '@app/utils/colorHelper';

interface AppTagProps {
  tag: TagInMezonAppDetailResponse;
  className?: string;
}

const AppTag = ({ tag, className }: AppTagProps) => {
  return (
    tag.color.includes('#') ? <Tag 
      color={lightenHex(tag.color, 40)}
      className={className}
      style={{
        // Update antd version later
        color: tag.color,
        borderColor: tag.color,
      }}
    >
      {tag.name}
    </Tag> : <Tag 
      color={tag.color}
      className={className}
    >
      {tag.name}
    </Tag>
  );
};

export default AppTag;
