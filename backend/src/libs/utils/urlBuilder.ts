import envConfig from "@config/env.config";

export function buildAppUrl(path: string, params?: Record<string, string>) {
  const baseUrl = envConfig().APP_URL;
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
}