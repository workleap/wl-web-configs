import { render, screen } from "@testing-library/react";
import { test } from "vitest";
import { About } from "../src/About.tsx";

test.concurrent("About page has a h1 element", async ({ expect }) => {
    render(<About />);

    expect(await screen.findByRole("heading")).toBeDefined();
});
