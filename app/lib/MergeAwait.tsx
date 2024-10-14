import { Await, useLocation } from "@remix-run/react";
import { Suspense, useEffect, useRef, useState } from "react";

type OptionalAwaitedAll<T extends [...any[]]> = T extends [
    infer Head,
    ...infer Tail
]
    ? [Awaited<Head> | undefined, ...OptionalAwaitedAll<Tail>]
    : [];

type MergeAwaitsProps<R extends [...any[]]> = {
    children: (value: OptionalAwaitedAll<R>) => React.ReactNode;
    resolve: readonly [...R];
};

/**
 * A complex component which allows an array of multiple promises to be given
 * and will rerender the given child function when each of the promises
 * independently resolves
 */
export const MergeAwaits = <R extends [...any[]]>(
    props: MergeAwaitsProps<R>
): JSX.Element => {
    const countRef = useRef(0);
    const location = useLocation();
    const [resolved, setResolved] = useState(
        () =>
            props.resolve.map((r) =>
                Promise.resolve(r) === r ? undefined : r
            ) as OptionalAwaitedAll<R>
    );

    if (props.resolve.length !== resolved.length) {
        throw new Error("The resolve prop should be a fixed length tuple");
    }

    useEffect(() => {
        if (props.resolve.length > 1) {
            setResolved(
                props.resolve.map((r) =>
                    Promise.resolve(r) === r ? undefined : r
                ) as OptionalAwaitedAll<R>
            );
        }
        // We don't want props.resolve to be used as trigger here, only the pathname
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    useEffect(() => {
        if (props.resolve.length > 1) {
            // Resolve the promises if they are promises
            if (props.resolve.some((r) => Promise.resolve(r) === r)) {
                const count = ++countRef.current;
                props.resolve.forEach((p, i) => {
                    Promise.resolve(p).then((r) => {
                        // Ensure that only the latest resolve is used
                        if (count === countRef.current) {
                            setResolved((current) => {
                                const newResolved = [...current];
                                newResolved[i] = r;
                                return newResolved as OptionalAwaitedAll<R>;
                            });
                        }
                    });
                });
            } else {
                // Otherwise the input is not promises so the resolved data
                // to the inputs
                setResolved(props.resolve as unknown as OptionalAwaitedAll<R>);
            }
        }
        // This is correct as we want to only rerun this if any of the resolve values update
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...props.resolve]);

    // Use suspense if only 1 thing to resolve
    if ((props.resolve.length as number) === 1) {
        return (
            <Suspense fallback={props.children([undefined] as OptionalAwaitedAll<R>)} >
                <Await resolve={props.resolve[0]}>
                    {(r) => props.children([r] as OptionalAwaitedAll<R>)}
                </Await>
            </Suspense>
        );
    }

    return props.children(resolved) as JSX.Element;
};