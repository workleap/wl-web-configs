import { Link, Outlet } from "react-router";
import "./RootLayout.css";

export function RootLayout() {
    return (
        <>
            <nav style={{ marginBottom: "20px" }}>
                <ul className="nav">
                    <li className="nav-item"><Link to="/">Home</Link></li>
                    <li className="nav-item"><Link to="/about">About</Link></li>
                    <li className="nav-item"><Link to="/fetch">Fetch</Link></li>
                    <li className="nav-item"><Link to="/app/1/2/page">Deep Page</Link></li>
                </ul>
            </nav>
            <Outlet />
        </>
    );
}
