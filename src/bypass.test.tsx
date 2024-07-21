/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Bypass } from "./bypass.js";

describe("renders correctly", () => {
    it("should render the next nested children", () => {
        const tree = render(
            <Bypass>
                <div>
                    <span>foo</span>
                </div>
            </Bypass>
        );
        expect(tree.container.textContent).toBe("foo");
        expect(tree.container.firstElementChild).toMatchSnapshot();
    });
    it("should render a single button", () => {
        const tree = render(
            <Bypass>
                <button>
                    <button>Click me</button>
                </button>
            </Bypass>
        );
        expect(tree.container.textContent).toBe("Click me");
        expect(tree.container.firstElementChild).toMatchSnapshot();
    });
    it("should render the next nested children with multiple elements", () => {
        const tree = render(
            <Bypass>
                <div>
                    <section>
                        <div>
                            <span>bar</span>
                        </div>
                    </section>
                </div>
            </Bypass>
        );
        expect(tree.container.textContent).toBe("bar");
        expect(tree.container.firstElementChild).toMatchSnapshot();
    });
    it("should render if next nested children is text node", () => {
        const tree = render(
            <Bypass>
                <div>bar</div>
            </Bypass>
        );
        expect(tree.container.textContent).toBe("bar");
        expect(tree.container.firstElementChild).toBeNull();
    });
    it("should not render anything if there are no next nested children", () => {
        const tree = render(
            <Bypass>
                <div></div>
            </Bypass>
        );
        expect(tree.container.firstElementChild).toBeNull();
    });
});

describe("with interaction", () => {
    const handleClick = vi.fn();
    const handleChildClick = vi.fn();

    beforeEach(() => {
        handleClick.mockReset();
        handleChildClick.mockReset();
        render(
            <button type="button" onClick={handleClick}>
                <Bypass>
                    <button type="button" onClick={handleChildClick}>
                        <span>Click me</span>
                    </button>
                </Bypass>
            </button>
        );
        screen.getAllByRole("button").forEach((e) => fireEvent.click(e));
    });

    it("works with onClick", async () => {
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleChildClick).toHaveBeenCalledTimes(0);
    });
});
