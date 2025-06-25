const imageMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/vnd.wap.wbmp',
  'image/bmp',
  'image/tiff'
];

const videoMimeTypes = [
  'video/mp4',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/mpeg',
  'video/quicktime',
  'video/x-flv',
  'video/x-ms-wmv'
];
const maxImageFileSize = 4 * 1024 * 1024;
const maxVideoFileSize = 25 * 1024 * 1024;

export {
  imageMimeTypes,
  videoMimeTypes,
  maxImageFileSize,
  maxVideoFileSize
}
