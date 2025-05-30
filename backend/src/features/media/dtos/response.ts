import { Expose } from "class-transformer";

export class GetMediaResponse {
  @Expose()
  public id: string;

  @Expose()
  public fileName: string;

  @Expose()
  public filePath: string;

  @Expose()
  public mimeType: string;

  @Expose()
  public ownerId: string;
}
 