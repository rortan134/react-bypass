import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";

/**
 * Skip one component node in the tree.
 * E.g. <Bypass><div><span>foo</span></div></Bypass> will render <span>foo</span>
 */
const Bypass = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot> & { disabled?: boolean }
>(({ disabled = false, children, ...props }, forwardedRef) => {
    if (disabled) {
        return <React.Fragment {...props}>{children}</React.Fragment>;
    }

    const nextNestedChildren = React.isValidElement(children)
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (React.Children.only(children).props.children as React.ReactNode)
        : null;

    const RenderNextNestedChildren = () => {
        return React.isValidElement(nextNestedChildren) ? (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            <Slottable>{nextNestedChildren.props.children}</Slottable>
        ) : null;
    };

    return (
        <Slot {...props} ref={forwardedRef}>
            <RenderNextNestedChildren />
        </Slot>
    );
});
Bypass.displayName = "Bypass";

export { Bypass };
