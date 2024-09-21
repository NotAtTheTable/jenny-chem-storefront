import { Link } from "@remix-run/react";
import { VariantOption } from "@shopify/hydrogen";

import "~/styles/app.css"

export function ProductOptions({ option }: { option: VariantOption }) {
    return (
        <div className="my-4" key={option.name}>
            {/* having this is a great battle, see if we put it back , let jenny decide <h3 className='font-display tracking-wide text-2xl text-jc-dark-blue mb-2'>{option.name}</h3> */}
            <div className="desktop-component flex flex-wrap gap-3">
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
                                textDecoration: 'none', // 
                            }}
                        >
                            <span style={{ display: 'block', transform: 'translateY(1px)' }}>{value}</span>
                        </Link>
                    );
                })}
            </div>
            <div className="mobile-component grid grid-cols-3 gap-3">
                {option.values.map(({ value, isAvailable, isActive, to }) => {
                    return (
                        <Link
                            className={`
                              border-[1px]
                              border-jc-light-blue
                              rounded-md
                              font-display
                              tracking-wide
                              px-2
                              py-1
                              text-xl
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
                                textDecoration: 'none', // Remove underline when clicked or focused
                            }}
                        >
                            <span style={{ display: 'block', transform: 'translateY(1px)' }}>{value}</span>
                        </Link>
                    );
                })}
            </div>
        </div >
    );
}