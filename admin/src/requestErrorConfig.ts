import { getLocale, RequestConfig, RequestOptions } from "@umijs/max";

export const errorConfig: RequestConfig = {
    requestInterceptors: [
      (config: RequestOptions) => {
        config.baseURL = 'https://defzone.net/api/';
        const url = config?.url?.concat(`?locale=${getLocale()}`);
        return { ...config, url };
      },
    ]
  };