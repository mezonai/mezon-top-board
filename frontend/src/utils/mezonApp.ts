import { AppStatus } from "@app/enums/AppStatus.enum";
import { MezonAppType } from "@app/enums/mezonAppType.enum";

export function mapStatusToColor(status: number) {
  switch (status) {
    case AppStatus.PENDING:
      return 'orange';
    case AppStatus.APPROVED:
      return 'green';
    case AppStatus.REJECTED:
      return 'red';
    case AppStatus.PUBLISHED:
      return 'blue';
    default:
      return 'gray';
  }
}

export function mapStatusToText(status: number) {
  switch (status) {
    case AppStatus.PENDING:
      return 'pending';
    case AppStatus.APPROVED:
      return 'approved';
    case AppStatus.REJECTED:
      return 'rejected';
    case AppStatus.PUBLISHED:
      return 'published';
    default:
      return 'unknown';
  }
}

export const getMezonInstallLink = (type: MezonAppType = MezonAppType.BOT, mezonAppId?: string): string => {
  const baseURL =
    type === MezonAppType.APP
      ? 'https://mezon.ai/developers/app/install/'
      : 'https://mezon.ai/developers/bot/install/'

  return (mezonAppId) ? `${baseURL}${mezonAppId}` : `${baseURL}`;
}
