import { AppStatus } from "@app/enums/AppStatus.enum";
import { MezonAppType } from "@app/enums/mezonAppType.enum";

export function getStatusConfig(status: AppStatus) {
  switch (status) {
    case AppStatus.PUBLISHED:
      return { color: 'blue', labelKey: 'status.published', tailwindBg: 'bg-info' };
    case AppStatus.APPROVED:
      return { color: 'green', labelKey: 'status.approved', tailwindBg: 'bg-success' };
    case AppStatus.PENDING:
      return { color: 'orange', labelKey: 'status.pending', tailwindBg: 'bg-warning' };
    case AppStatus.REJECTED:
      return { color: 'red', labelKey: 'status.rejected', tailwindBg: 'bg-danger' };
    default:
      return { color: 'gray', labelKey: 'status.unknown', tailwindBg: 'bg-muted' };
  }
}

export const getMezonInstallLink = (type: MezonAppType = MezonAppType.BOT, mezonAppId?: string): string => {
  const baseURL =
    type === MezonAppType.APP
      ? 'https://mezon.ai/developers/app/install/'
      : 'https://mezon.ai/developers/bot/install/'

  return (mezonAppId) ? `${baseURL}${mezonAppId}` : `${baseURL}`;
}