/*!
 * Why JavaScript still doesn't have a native debounce...
 * AI Generated code.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { useEffect, useMemo, useRef } from 'react';

export const debounce = <TArgs extends unknown[]>(
    callback: (...args: TArgs) => void,
    wait: number
) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const clear = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    const handler = (...args: TArgs) => {
        clear();

        timeoutId = setTimeout(() => {
            callback(...args);
            timeoutId = null;
        }, wait);
    };

    return [handler, clear] as const;
};

export const useDebounce = <TArgs extends unknown[]>(
    callback: (...args: TArgs) => void,
    wait: number
) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const [handler, clear] = useMemo(() => {
        return debounce((...args: TArgs) => {
            callbackRef.current(...args);
        }, wait);
    }, [wait]);

    useEffect(() => {
        return () => {
            clear();
        };
    }, [clear]);

    return [handler, clear] as const;
};
