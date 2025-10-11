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

    // Rely on React.Children.only to enforce exactly one top-level child and throw otherwise
    // See: https://react.dev/reference/react/Children#children-only
    const onlyChild = React.Children.only(children as React.ReactElement);
    const nextNestedChildren = (onlyChild as React.ReactElement<{ children?: React.ReactNode }>)
        .props.children;

    const RenderText = ({ value }: { readonly value: string }) =>
        value as unknown as React.ReactElement;

    return (
        <Slot {...rest} ref={forwardedRef}>
            {React.isValidElement(nextNestedChildren) ? (
                <Slottable>{nextNestedChildren}</Slottable>
            ) : typeof nextNestedChildren === "string" ? (
                <RenderText value={nextNestedChildren} />
            ) : null}
        </Slot>
    );
});
Bypass.displayName = "Bypass";

export { Bypass };
export type { BypassElement, BypassProps };
