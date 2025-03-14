import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { About } from "./About.tsx";
import { Fetch } from "./Fetch.tsx";
import { Home } from "./Home.tsx";
import { RootLayout } from "./RootLayout.tsx";

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/fetch",
                element: <Fetch />
            }
        ]
    }
]);

export function App() {
    return (
        <RouterProvider
            router={router}
        />
    );
}
