import { LoaderFunctionArgs, redirect } from '@shopify/remix-oxygen';
import { STOREFRONT_CUSTOMER_ACCESS_TOKEN_CREATE } from '~/graphql/customer-account/CustomerAccessTokenCreateMutation';
import { CUSTOMER_COMPANY_LOCATIONS } from '~/graphql/customer-account/CustomerCompanyLocationsQuery';

export async function loader({ context }: LoaderFunctionArgs) {
  // B2B mutate for the storefrontCustomerAccessToken
  const { data: tokenData } = await context.customerAccount.mutate(STOREFRONT_CUSTOMER_ACCESS_TOKEN_CREATE);
  const { data: locationData } = await context.customerAccount.query(CUSTOMER_COMPANY_LOCATIONS)

  context.customerAccount.UNSTABLE_setBuyer({
    customerAccessToken: tokenData.storefrontCustomerAccessTokenCreate?.customerAccessToken || undefined,
    companyLocationId: locationData.customer.companyContacts.edges[0].node.company?.locations.edges[0].node.id || undefined
  })

  return redirect('/account/orders');
}

