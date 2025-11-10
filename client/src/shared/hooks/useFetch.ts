import { baseAxios } from '@/app/config/axios';
import { removeFalsyValues } from '@/shared/utils/object';
import { useAppBridge } from '@shopify/app-bridge-react';
import type { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

export interface IFetchOptions {
  path: string;
  options?: AxiosRequestConfig;
  setLoadingState?: boolean;
  setDataState?: boolean;
}

export const useFetch = <T = any>(
  initiallyLoading: boolean = false,
  initialState?: T
) => {
  const [data, setData] = useState<T | null>(initialState || null);
  const [loading, setLoading] = useState(initiallyLoading);
  const [error, setError] = useState('');
  const shopify = useAppBridge();

  const makeRequest = useCallback(
    async ({
      path,
      options = {},
      setLoadingState = true,
      setDataState = true,
    }: IFetchOptions): Promise<T | { error: any } | undefined> => {
      try {
        const token = await shopify.idToken();
        setError('');

        if (setLoadingState) setLoading(true);

        const headers: AxiosRequestConfig['headers'] = {
          ...options.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const params = removeFalsyValues({
          ...options.params,
          shop: shopify.config.shop,
        });

        const { data } = await baseAxios(`api/${path}`, {
          ...options,
          params,
          headers,
        });

        if (setDataState) setData(data);

        return data as T;
      } catch (er) {
        console.log('Error making request', er);
      } finally {
        setLoading(false);
      }
    },
    [shopify.idToken, shopify.config.shop]
  );

  return {
    data,
    loading,
    makeRequest,
    setData,
    error,
    setError,
    setLoading,
  };
};
