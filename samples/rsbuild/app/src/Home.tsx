import { helloFrom } from "@rsbuild-sample/rslib-lib";
import "./Home.css";
import { ReactComponent as AddIcon } from "./assets/add.svg";

export function Home() {
    return (
        <div>
            <h1 className="title">Home</h1>
            <p>{helloFrom("the homepage")}</p>
            <p>
                <span>
                    Here's an SVG icon loaded with <code>@svgr/webpack</code>:
                </span>
                <AddIcon />
            </p>
        </div>
    );
}
