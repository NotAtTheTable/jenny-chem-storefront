import { Link } from "@remix-run/react";
import { VariantOption } from "@shopify/hydrogen";

export function ProductOptions({ option }: { option: VariantOption }) {
    return (
        <div className="product-options my-4" key={option.name}>
            <h3 className='font-display tracking-wide text-2xl text-jc-dark-blue mb-2'>{option.name}</h3>
            <div className="product-options-grid">
                {option.values.map(({ value, isAvailable, isActive, to }) => {
                    return (
                        <Link
                            className={`
                  border-[1.5px]
                  border-jc-light-blue
                  rounded
                  font-display
                  tracking-wide
                  px-4
                  py-1
                  leading-none
                  text-lg
                  ${isActive ? "text-white bg-jc-dark-blue" : "text-jc-dark-blue"}
                  ${isAvailable ? "text-opacity-100" : "text-opacity-30"}
                `}
                            key={option.name + value}
                            prefetch="intent"
                            preventScrollReset
                            replace
                            to={to}
                            style={{
                                boxShadow: isActive ? "0 0 6px rgba(23,34,93,0.35)" : 'unset',
                            }}
                        >
                            {value}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}