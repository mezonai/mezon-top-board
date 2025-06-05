import { GetPublicProfileResponse } from "@app/services/api/user/user.types";

export type CardInfoProps = {
    userInfo?: GetPublicProfileResponse;
    isPublic?: boolean;
};