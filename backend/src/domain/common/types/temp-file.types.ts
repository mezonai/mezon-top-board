export type SaveTempFileArgs = {
  id?: string;
  path?: string;
  expiredHours?: number;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}