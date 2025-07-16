import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Button } from "./Button.tsx";

const meta: Meta<typeof Button> = {
    component: Button
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: "Click me!"
    }
};
