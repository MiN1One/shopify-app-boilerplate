import type { IShop } from '@/entities/shop/interfaces/shop';
import { useFetch } from '@/shared/hooks/useFetch';
import { useAppBridge } from '@shopify/app-bridge-react';
import { createContext, useContext, useEffect, type FC } from 'react';

interface IGlobalContext {
  shop: IShop | null;
}

interface GlobalContextProviderProps {
  children: React.ReactNode;
}

const GlobalContext = createContext({} as IGlobalContext);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider: FC<GlobalContextProviderProps> = ({
  children,
}) => {
  const { makeRequest, data: shop, loading } = useFetch<IShop>(true);
  const shopify = useAppBridge();

  useEffect(() => {
    shopify.loading(true);
    makeRequest({ path: 'auth' }).finally(() => shopify.loading(false));
  }, [makeRequest]);

  const state: IGlobalContext = {
    shop,
  };

  if (!shop && !loading) {
    return (
      <s-page>
        <s-banner heading="Something went wrong" tone="info" dismissible>
          Could not connect to the server😢. Please try again later
        </s-banner>
      </s-page>
    );
  }

  return (
    <GlobalContext.Provider value={state}>
      <s-page>{children}</s-page>
    </GlobalContext.Provider>
  );
};
