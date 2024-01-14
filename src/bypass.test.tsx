import { render } from "@testing-library/react";
import { Bypass } from "./bypass";
import { describe, it, expect } from "vitest";
import * as React from "react";

describe("Bypass component", () => {
    it("should render the next nested children", () => {
        const tree = render(
            <Bypass>
                <div>
                    <span>foo</span>
                </div>
            </Bypass>
        );
        expect(tree.container.textContent).toBe("foo");
        expect(tree.container).toMatchSnapshot();
    });
    it("should not render content if next nested children is text node (can't forward through)", () => {
        const tree = render(
            <Bypass>
                <div>bar</div>
            </Bypass>
        );
        console.log(tree.container.innerHTML);
        expect(tree.container.textContent).toBe("");
        expect(tree.container).toMatchSnapshot();
    });
    it("should not render anything if there are no next nested children", () => {
        const tree = render(
            <Bypass>
                <div></div>
            </Bypass>
        );
        expect(tree.container.firstChild).toBeNull();
    });
});
