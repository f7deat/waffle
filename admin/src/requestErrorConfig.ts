import { getLocale, RequestConfig, RequestOptions } from "@umijs/max";

export const errorConfig: RequestConfig = {
    requestInterceptors: [
      (config: RequestOptions) => {
        config.headers = {
          authorization: `Bearer ${localStorage.getItem('wf_token')}`,
        }
        const url = config?.url?.concat(`?locale=${getLocale()}`);
        return { ...config, url };
      },
    ]
  };