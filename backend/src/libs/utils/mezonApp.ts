import { MezonAppType } from "@domain/common/enum/mezonAppType";

export const getMezonInstallLink = (type: MezonAppType = MezonAppType.BOT, mezonAppId?: string): string => {
    const baseURL =
        type === MezonAppType.APP
            ? 'https://mezon.ai/developers/app/install/'
            : 'https://mezon.ai/developers/bot/install/'

    return (mezonAppId) ? `${baseURL}${mezonAppId}` : `${baseURL}`;
}