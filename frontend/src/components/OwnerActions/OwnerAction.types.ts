import { AppVersion } from "@app/types/appVersion.types";
import { ViewMode } from "@app/enums/viewMode.enum";

export type OwnerActionsProps = {
  data: any;
  isBotCard?: boolean;
  mode?: ViewMode;
  onNewVersionClick?: (version?: AppVersion) => void
}