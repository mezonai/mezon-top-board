export type OAuth2TokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
}

export type OAuth2UserInfoResponse = {
    sub: string;
    aud: string[];
    auth_time: number;
    avatar?: string;
    display_name?: string;
    mezon_id: string;
    username: string;
    iss: string;
    iat: number;
    rat: number;
}