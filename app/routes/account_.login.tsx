import { LoaderFunctionArgs, redirect, type ActionFunctionArgs } from '@shopify/remix-oxygen';

// if we dont implement this, /account/logout will get caught by account.$.tsx to do login
export async function loader({ context }: LoaderFunctionArgs) {
  return context.customerAccount.login();
}
