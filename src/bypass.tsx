import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";

type BypassElement = React.ElementRef<typeof Slot>;
interface BypassProps extends React.ComponentPropsWithoutRef<typeof Slot> {
    disabled?: boolean;
}

/**
 * Bypass component that skips one level of nesting in the component tree.
 *
 * @component
 * @example
 * // Basic usage
 * <Bypass>
 *   <div>
 *     <span>Content</span>
 *   </div>
 * </Bypass>
 * // Renders: <span>Content</span>
 *
 * @example
 * // With disabled prop
 * <Bypass disabled>
 *   <div>
 *     <span>Content</span>
 *   </div>
 * </Bypass>
 * // Renders: <div><span>Content</span></div>
 *
 * @param {Object} props - The component props
 * @param {boolean} [props.disabled=false] - When true, the component renders its children without bypassing
 * @param {React.ReactNode} props.children - The child elements to render
 *
 * @returns {React.ReactElement} The rendered component
 *
 * @throws {Error} Throws an error if multiple children are provided
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/utilities/slot Radix UI Slot}
 */
const Bypass = React.forwardRef<BypassElement, BypassProps>((props, forwardedRef) => {
    const { disabled = false, children, ...rest } = props;
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
        <Slot {...rest} ref={forwardedRef}>
            <RenderNextNestedChildren />
        </Slot>
    );
});
Bypass.displayName = "Bypass";

export { Bypass };
export type { BypassElement, BypassProps };
