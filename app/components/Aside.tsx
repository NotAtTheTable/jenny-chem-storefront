import { Plus } from "lucide-react";
import DashDivider from "./foundational/DashDivider";
import Heading from "./foundational/Heading";

/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  return (
    <div aria-modal className="overlay !z-[80]" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside>
        <header className="aside-container">
          <div>
            <h3 className="text-3xl text-center text-jc-dark-blue font-display">{heading}</h3>
            <div className="w-full mt-1 flex items-center justify-center">
              <div className={`w-16 h-[3px] bg-jc-light-blue`} />
            </div>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-[75%]">
            <CloseAside />
          </div>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className="close" href="#" onChange={() => history.go(-1)}>
      <Plus strokeWidth={3} className="rotate-45 text-jc-dark-blue" />
    </a>
  );
}
