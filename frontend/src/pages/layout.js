import { Outlet } from "react-router-dom";

import Header from '../components/header';
import Footer from '../components/footer';
import Copyright from "../components/copyright";

function Layout() {
    return (
        <>
            <Header />
                <Outlet />
            <Footer />
            <Copyright />
        </>
    )


}

export default Layout