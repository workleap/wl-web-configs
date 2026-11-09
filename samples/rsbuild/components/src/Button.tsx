import type { HTMLProps, ReactNode } from "react";
import "./Button.css";
import styles from "./Button.module.css";

export interface ButtonProps extends Omit<HTMLProps<HTMLButtonElement>, "type" | "className"> {
    children: ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
    return (
        <button type="button" className={`sample-button-bg ${styles.sampleButtonColor}`} {...props}>
            {children}
        </button>
    );
}
