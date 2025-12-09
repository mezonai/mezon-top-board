import { Expose } from "class-transformer";

export class GetTempFileResponse {
  @Expose()
  public id: string;
  @Expose()
  public fileName: string;
  @Expose()
  public filePath: string;
  @Expose()
  public mimeType: string;
  @Expose()
  public expiredAt: Date;
  @Expose()
  public ownerId: string;
  @Expose()
  public createdAt: Date;
}