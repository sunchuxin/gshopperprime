import {defineConfig, CookieSessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {
    defaultCountryCode: 'US',
    defaultLanguageCode: 'EN',
    // storeDomain:
    //   // @ts-ignore
    //   Oxygen?.env?.PUBLIC_STORE_DOMAIN || 'hydrogen-preview.myshopify.com',
    // storefrontToken:
    //   // @ts-ignore
    //   Oxygen?.env?.PUBLIC_STOREFRONT_API_TOKEN ||
    //   'a6b0d05b7f99774e705ac16845c32564',
    storeDomain: 'cyrus-gshopper-test.myshopify.com',
    storefrontToken:'a6b0d05b7f99774e705ac16845c32564',
    privateStorefrontToken:
      // @ts-ignore
      Oxygen?.env?.PRIVATE_STOREFRONT_API_TOKEN,
    storefrontApiVersion: '2022-07',
    // @ts-ignore
    storefrontId: Oxygen?.env?.PUBLIC_STOREFRONT_ID,
  },
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
