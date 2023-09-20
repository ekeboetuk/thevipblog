import { Outlet } from "react-router-dom";

import {ErrorBoundary} from '../components/errors'
import Header from '../components/header';
import Footer from '../components/footer';
import Copyright from "../components/copyright";

function Layout() {
    return (
        <div className="d-flex flex-column" style={{minHeight: "100vh"}}>
            <Header />
            <ErrorBoundary fallback={ <p>Error connecting to database, please try again</p>}>
                <div className="mb-auto">
                    <Outlet />
                </div>
            </ErrorBoundary>
            <Footer />
            <div className="position-fixed bottom-0 end-0 alert text-center me-4" id="alert" role="alert"></div>
            <Copyright />
        </div>
    )


}

export default Layout