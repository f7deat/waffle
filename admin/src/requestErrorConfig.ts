import { getLocale, RequestConfig, RequestOptions } from "@umijs/max";

export const errorConfig: RequestConfig = {
    requestInterceptors: [
      (config: RequestOptions) => {
        config.baseURL = new URL(`api/`, localStorage.getItem('wf_URL') || 'https://defzone.net/api/').href;
        const url = config?.url?.concat(`?locale=${getLocale()}`);
        return { ...config, url };
      },
    ]
  };