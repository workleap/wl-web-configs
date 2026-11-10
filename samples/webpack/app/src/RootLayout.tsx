import { Link, Outlet } from "react-router";
import "./RootLayout.css";

const navStyle = { marginBottom: "20px" };

export function RootLayout() {
    return (
        <>
            <nav style={navStyle}>
                <ul className="nav">
                    <li className="nav-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/fetch">Fetch</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    );
}
