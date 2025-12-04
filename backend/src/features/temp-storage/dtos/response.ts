import { TempSourceFileStatus } from "@domain/common/enum/tempSourceFileStatus";
import { Expose } from "class-transformer";

export class GetTempSourceFileResponse {
  @Expose()
  public id: string;
  @Expose()
  public fileName: string;
  @Expose()
  public filePath: string;
  @Expose()
  public status: TempSourceFileStatus;
  @Expose()
  public completedAt: Date;
  @Expose()
  public ownerId: string;
}
 