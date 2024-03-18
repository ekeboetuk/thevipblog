import { Outlet, useParams } from "react-router-dom";

import { ErrorBoundary } from "../components/errors";
import Header from "../components/header";
import Footer from "../components/footer";

function Layout() {
    let title
    const path = useParams().path
    if(!path) {
        title = document.location.pathname.replace('/','')
    }else{
        title = path.charAt(0).toUpperCase() + path.slice(1)
    }

    return (
        <>
            <Header
                title={title.replace('-',' ')}
                background={`/media/${title.toLowerCase()}-banner.jpeg`}
            />
            <main>
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </main>
            <Footer />
            <div
                className="position-fixed bottom-0 end-0 alert text-center me-4"
                id="alert"
                role="alert"
            ></div>
        </>
    );
}

export default Layout;
