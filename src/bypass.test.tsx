import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Bypass } from "./bypass.js";

describe("renders correctly", () => {
    afterEach(cleanup);
    it("should render the next nested children", () => {
        const view = render(
            <Bypass>
                <div>
                    <span>foo</span>
                </div>
            </Bypass>,
        );
        expect(view.container).toHaveTextContent("foo");
        expect(view.container.firstElementChild).toMatchSnapshot();
    });
    it("should render a single button", () => {
        const view = render(
            <Bypass>
                <button>
                    <button>Click me</button>
                </button>
            </Bypass>,
        );
        expect(view.container).toHaveTextContent("Click me");
        expect(view.container.firstElementChild).toMatchSnapshot();
    });
    it("should render the next nested children with multiple elements", () => {
        const view = render(
            <Bypass>
                <div>
                    <section>
                        <div>
                            <span>bar</span>
                        </div>
                    </section>
                </div>
            </Bypass>,
        );
        expect(view.container).toHaveTextContent("bar");
        expect(view.container.firstElementChild).toMatchSnapshot();
    });
    it("should render if next nested children is text node", () => {
        const view = render(
            <Bypass>
                <div>bar</div>
            </Bypass>,
        );
        expect(view.container).toHaveTextContent("bar");
        expect(view.container.firstElementChild).toBeNull();
    });
    it("should not render anything if there are no next nested children", () => {
        const view = render(
            <Bypass>
                <div></div>
            </Bypass>,
        );
        expect(view.container.firstElementChild).toBeNull();
    });
});

describe("prop and attribute forwarding", () => {
    afterEach(cleanup);
    it("forwards props to the rendered grandchild and merges className", () => {
        const handleClick = vi.fn();
        render(
            <Bypass
                onClick={handleClick}
                className="from-bypass"
                id="the-id"
                aria-label="hello"
                data-qa="probe"
                style={{ color: "red" }}>
                <div>
                    <button className="inner" style={{ background: "blue" }}>
                        Hello
                    </button>
                </div>
            </Bypass>,
        );
        const button = screen.getByRole("button");
        // attributes
        expect(button).toHaveAttribute("id", "the-id");
        expect(button).toHaveAttribute("aria-label", "hello");
        expect(button).toHaveAttribute("data-qa", "probe");
        // className merge (contains both tokens)
        expect(button).toHaveClass("inner");
        expect(button).toHaveClass("from-bypass");
        // style merge (distinct style keys)
        expect(button).toHaveStyle({ color: "rgb(255, 0, 0)" });
        expect(button).toHaveStyle({ background: "blue" });
        // event forwarded
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

describe("disabled behavior", () => {
    afterEach(cleanup);
    it("renders original children untouched and preserves original handlers", () => {
        const handleBypass = vi.fn();
        const handleChild = vi.fn();
        const view = render(
            <Bypass disabled onClick={handleBypass}>
                <div>
                    <button onClick={handleChild}>Hi</button>
                </div>
            </Bypass>,
        );
        // the top-level element remains the original wrapper
        expect(view.container.firstElementChild?.tagName).toBe("DIV");
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(handleChild).toHaveBeenCalledTimes(1);
        expect(handleBypass).toHaveBeenCalledTimes(0);
    });
});

describe("refs", () => {
    afterEach(cleanup);
    it("forwards ref to the rendered grandchild DOM element", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Bypass ref={ref}>
                <div>
                    <button type="button">Ref me</button>
                </div>
            </Bypass>,
        );
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        expect(ref.current?.textContent).toContain("Ref me");
    });

    it("sets ref to null when result is text or nothing", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(
            <Bypass ref={ref}>
                <div>text-only</div>
            </Bypass>,
        );
        expect(ref.current).toBeNull();
    });
});

describe("runtime dynamics", () => {
    afterEach(cleanup);
    it("updates DOM safely when children shape changes", () => {
        const Dynamic = () => {
            const [show, setShow] = React.useState(false);
            return (
                <div>
                    <button type="button" onClick={() => setShow((v) => !v)}>
                        toggle
                    </button>
                    <Bypass>
                        <div>{show ? <span>one</span> : null}</div>
                    </Bypass>
                </div>
            );
        };
        render(<Dynamic />);
        // initially nothing
        expect(screen.queryByText("one")).toBeNull();
        // toggle to show content
        fireEvent.click(screen.getByText("toggle"));
        expect(screen.getByText("one")).toBeInTheDocument();
        // toggle back to hide
        fireEvent.click(screen.getByText("toggle"));
        expect(screen.queryByText("one")).toBeNull();
    });
});

describe("edge cases", () => {
    afterEach(cleanup);
    it("renders nothing for array grandchild", () => {
        const view = render(
            <Bypass>
                <div>{[<span key="a">a</span>, <em key="b">b</em>]}</div>
            </Bypass>,
        );
        expect(view.container.firstElementChild).toBeNull();
    });

    it("renders nothing for number grandchild", () => {
        const view = render(
            <Bypass>
                <div>{42}</div>
            </Bypass>,
        );
        expect(view.container.firstElementChild).toBeNull();
    });

    it("throws when top-level child is a string (not a React element)", () => {
        expect(() => render(<Bypass>{"top"}</Bypass>)).toThrow();
    });

    it("throws with multiple top-level children", () => {
        expect(() =>
            render(
                <Bypass>
                    <div />
                    <div />
                </Bypass>,
            ),
        ).toThrow();
    });

    it("removes button semantics when bypassing to non-button grandchild", () => {
        const view = render(
            <Bypass>
                <button>
                    <span>content</span>
                </button>
            </Bypass>,
        );
        expect(view.container).toHaveTextContent("content");
        expect(screen.queryByRole("button")).toBeNull();
    });
});

describe("with interaction", () => {
    afterEach(cleanup);
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
            </button>,
        );
        screen.getAllByRole("button").forEach((e) => fireEvent.click(e));
    });

    it("works with onClick", async () => {
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleChildClick).toHaveBeenCalledTimes(0);
    });
});
