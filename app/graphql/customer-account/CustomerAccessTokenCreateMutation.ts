//Creating a StorefrontCustomerAccessToken for b2b customers using 
// @https://shopify.dev/docs/storefronts/headless/bring-your-own-stack/b2b

export const STOREFRONT_CUSTOMER_ACCESS_TOKEN_CREATE = `#graphql
    mutation storefrontCustomerAccessTokenCreate {
        storefrontCustomerAccessTokenCreate {
          customerAccessToken
          userErrors {
            field
            message
          }
        }
      }
` as const
