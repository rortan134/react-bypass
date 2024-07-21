/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { Bypass } from "./bypass.js";

describe("Bypass component", () => {
    it("should render the next nested children", () => {
        const tree = render(
            <Bypass>
                <span>
                    <div>foo</div>
                </span>
            </Bypass>
        );
        expect(tree.container.textContent).toBe("foo");
        expect(tree.container).toMatchSnapshot();
    });
    it("should render the next nested children with multiple elements", () => {
        const tree = render(
            <Bypass>
                <div>
                    <div>
                        <div>
                            <span>bar</span>
                        </div>
                    </div>
                </div>
            </Bypass>
        );
        expect(tree.container.textContent).toBe("bar");
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
