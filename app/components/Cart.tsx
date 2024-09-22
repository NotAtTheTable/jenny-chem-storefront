import { CartForm, Image, Money } from '@shopify/hydrogen';
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import { Link } from '@remix-run/react';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import BlueInfoIcon from '~/assets/foundational/blue_info_icon.svg'
import { Plus } from 'lucide-react';
import NumericInput from './foundational/NumericInput';
import { useEffect, useState } from 'react';
import { ArrowButton, Button } from './foundational/ArrowButton';
import BlueSecureIcon from "~/assets/foundational/blue_secure_icon.svg"

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

export function CartMain({ layout, cart }: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartDeliveryBanner />
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDeliveryBanner() {
  return (
    <div className='bg-[#7094E020] text-center py-[3px]'>
      <div className='mx-[25px] relative'>
        <span className='text-jc-dark-blue'>Free Delivery on selected orders over £25*</span>
        <img className='absolute right-[3px] top-1/2 transform -translate-y-1/2' src={BlueInfoIcon} />
      </div>
    </div>
  )
}

function CartDetails({ layout, cart }: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div>
      <CartLines lines={cart?.lines} layout={layout} />
      {cart && cartHasItems && (
        <CartSummary cart={cart} layout={layout} />
      )}
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div className='aside-container' aria-labelledby="cart-lines">
      <ul>
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="flex gap-3 mb-3">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={124}
          loading="lazy"
          width={124}
        />
      )}

      <div className='flex-grow'>
        <div className='flex justify-between border-b border-jc-light-blue border-opacity-50 pb-1'>
          <Link
            className='text-jc-dark-blue'
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                // close the drawer
                window.location.href = lineItemUrl;
              }
            }}
          >
            <p className='line-clamp-1'>
              <strong>{product.title.toUpperCase()}</strong>
            </p>
          </Link>
          <CartLineRemoveButton lineIds={[line.id]} />
        </div>
        <div className='text-jc-dark-blue text-sm mt-2 mb-1 flex flex-wrap divide-x divide-jc-light-blue'>
          {selectedOptions.map((option, index) => (
            <span key={option.name} className={index !== 0 ? 'px-2' : 'pr-2'}>
              <strong>{option.value}</strong>
            </span>
          ))}
        </div>
        <div className='flex justify-between items-end'>
          <CartLineQuantity line={line} />
          <CartLinePrice line={line} as="span" />
        </div>
      </div>
    </li>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl: string }) {
  if (!checkoutUrl) return null;

  return (
    <div className='aside-container'>
      <div className='flex items-center gap-1 text-jc-dark-blue mb-5'><img src={BlueSecureIcon} /> Money Back Guarantee within 30 days of your purchase.</div>
      <a href={checkoutUrl} target="_self">
        <ArrowButton label='CHECKOUT SECURELY' />
      </a>

    </div>
  );
}

export function CartSummary({
  cart,
  layout,
}: {
  cart: CartApiQueryFragment
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  const { discountCodes, cost } = cart;

  return (
    <div aria-labelledby="cart-summary" className={className}>
      {/* <CartDiscounts discountCodes={discountCodes} /> */}
      <div className='h-[1px] bg-jc-light-blue bg-opacity-50' />
      <CartCostSummary cost={cost} />
      <div className='h-[1px] bg-jc-light-blue bg-opacity-50' />
      {/* <CartShippingCalculator /> */}
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}

function CartCostSummary({ cost }: { cost: CartApiQueryFragment["cost"] }) {
  return (
    <div className='aside-container text-jc-dark-blue'>
      <dl className="flex justify-between ">
        <dt>Subtotal</dt>
        <dd>
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <dl className="flex justify-between mb-2">
        <dt>Estimated Shipping</dt>
        <dd>
          xxxx
        </dd>
      </dl>
      <strong>
        <dl className="flex justify-between text-2xl">
          <dt >Total</dt>
          <dd>
            {cost?.totalAmount ? (
              <Money data={cost?.totalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
      </strong>
    </div>
  )
}

function CartLineRemoveButton({ lineIds }: { lineIds: string[] }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button type="submit"><Plus strokeWidth={3} height={18} className="rotate-45 text-jc-dark-blue" /></button>
    </CartForm>
  );
}

function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity } = line;

  const [currentQuantity, setCurrentQuantity] = useState<number>(quantity);

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines: [{ id: lineId, quantity: currentQuantity }] }}
    >
      <div>
        <p className='text-jc-dark-blue text-sm'><strong>Quantity:</strong></p>
        <NumericInput inputReadOnly min={1} value={currentQuantity} onChange={(newQuantity) => setCurrentQuantity(newQuantity)} />
      </div>
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className='text-xl text-jc-dark-blue'>
      <strong> <Money {...passthroughProps} data={moneyV2} /></strong>
    </div>
  );
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/collections';
          }
        }}
      >
        Continue shopping →
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div className='aside-container [&>form]:max-w-[500px]'>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <h3 className='text-lg text-jc-dark-blue mb-2'>Discount Code?</h3>
          <div className='flex gap-4'>
            <input
              className='rounded-full px-4 py-1 flex-grow'
              type="text" name="discountCode" placeholder="Discount code"
            />
            <Button className='w-max' type="submit" label="APPLY CODE" />
          </div>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function CartShippingCalculator() {
  return (
    <div className='aside-container [&>form]:max-w-[500px]'>
      {/* <UpdateDiscountForm discountCodes={codes}> BUT SHIPPING CALCULATOR FORM */}
      <div>
        <h3 className='text-lg text-jc-dark-blue mb-2'>Shipping Calculator</h3>
        <div className='flex gap-4'>
          <input
            className='rounded-full px-4 py-1 flex-grow'
            type="text" name="shippingPostcode" placeholder="Enter post code"
          />
          <Button className='w-max' type="submit" label="CALCULATE" />
        </div>
      </div>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
