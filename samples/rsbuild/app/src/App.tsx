import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { About } from "./About.tsx";
import { DeepPage } from "./DeepPage.tsx";
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
            },
            {
                path: "/app",
                children: [
                    {
                        path: "/app/1",
                        children: [
                            {
                                path: "/app/1/2",
                                children: [
                                    {
                                        path: "/app/1/2/page",
                                        element: <DeepPage />
                                    }
                                ]
                            }
                        ]
                    }
                ]
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
