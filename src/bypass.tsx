import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";

type BypassElement = React.ElementRef<typeof Slot>;
interface BypassProps extends React.ComponentPropsWithoutRef<typeof Slot> {
    disabled?: boolean;
}

/**
 * Skip one component node in the tree.
 *
 * e.g. `<Bypass><div><span>foo</span></div></Bypass>`
 *
 * renders `<span>foo</span>`
 *
 * `<div>` gets "bypassed"
 */
const Bypass = React.forwardRef<BypassElement, BypassProps>(
    ({ disabled = false, children, ...props }, forwardedRef) => {
        if (disabled) {
            return children;
        }

        const nextNestedChildren = React.isValidElement(children)
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              (React.Children.only(children).props.children as React.ReactNode)
            : null;

        const RenderNextNestedChildren = () => {
            return React.isValidElement(nextNestedChildren) ? (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                <Slottable>{nextNestedChildren}</Slottable>
            ) : typeof nextNestedChildren === "string" ? (
                nextNestedChildren
            ) : null;
        };

        return (
            <Slot {...props} ref={forwardedRef}>
                <RenderNextNestedChildren />
            </Slot>
        );
    },
);
Bypass.displayName = "Bypass";

export { Bypass };
export type { BypassElement, BypassProps };
