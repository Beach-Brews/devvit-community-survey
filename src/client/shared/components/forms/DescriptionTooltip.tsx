/*!
 * A helper component for consistent description tooltips.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { useState, useRef, useLayoutEffect } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

export interface DescriptionTooltipProps {
    text: string;
}

export const DescriptionTooltip = ({
    text
}: DescriptionTooltipProps) => {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({
        top: 0,
        left: 0,
        placement: "bottom" as "top" | "bottom"
    });

    useLayoutEffect(() => {
        if (!open || !anchorRef.current || !tooltipRef.current) return;

        const margin = 8;
        const anchor = anchorRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();

        let left = anchor.left + anchor.width / 2 - tooltip.width / 2;
        let top = anchor.bottom + margin;
        let placement: "top" | "bottom" = "bottom";

        // Clamp horizontally
        left = Math.max(
            margin,
            Math.min(left, window.innerWidth - tooltip.width - margin)
        );

        // Flip above if bottom would overflow
        if (top + tooltip.height > window.innerHeight - margin) {
            top = anchor.top - tooltip.height - margin;
            placement = "top";
        }

        // Clamp vertically as fallback
        top = Math.max(
            margin,
            Math.min(top, window.innerHeight - tooltip.height - margin)
        );

        setPos({ top, left, placement });
    }, [open, text]);

    return (
        <>
            <button
                ref={anchorRef}
                type="button"
                className="inline-flex cursor-pointer text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                onTouchStart={() => setOpen(s => !s)}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                aria-label="More information"
            >
                <InformationCircleIcon className="size-4" />
            </button>
            {open &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        className="
                            fixed z-50 w-[min(16rem,calc(100vw-1rem))]
                            rounded-xl border border-neutral-400 dark:border-neutral-600
                            bg-neutral-50 dark:bg-neutral-900 px-3 py-2
                            text-xs text-neutral-900 dark:text-neutral-100 shadow-lg
                            pointer-events-none
                        "
                        style={{
                            top: pos.top,
                            left: pos.left
                        }}
                    >
                        {text}
                    </div>,
                    document.body
                )}
        </>
    );
}
