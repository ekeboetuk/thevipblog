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
            <div className="position-fixed bottom-0 end-0 alert text-center me-4" id="alert" role="alert"></div>
            <Copyright />
        </>
    )


}

export default Layout