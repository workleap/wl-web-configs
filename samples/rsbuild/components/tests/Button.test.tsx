import { render, screen } from "@testing-library/react";
import { test } from "vitest";
import { Button } from "../src/Button.tsx";

test.concurrent("About page has a h1 element", async ({ expect }) => {
    render(<Button>My button</Button>);

    expect(await screen.findByRole("button")).toBeDefined();
});
