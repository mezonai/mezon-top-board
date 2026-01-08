import { AppVersion } from "@app/types/appVersion.types";
import { ViewMode } from "@app/enums/viewMode.enum";

export type BotActionsProps = {
  data: any;
  mode?: ViewMode;
  onNewVersionClick?: (version?: AppVersion) => void
}