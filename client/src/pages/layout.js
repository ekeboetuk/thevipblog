import { Outlet, useParams } from "react-router-dom";

import { ErrorBoundary } from "../components/errors";
import Header from "../components/header";
import Footer from "../components/footer";

function Layout() {
    const slug = useParams().slug
    const path = useParams().path
    let title
    if(!path) {
        title= document.location.pathname.replace('/','')
    }else{
        if(slug){
            title = null
        }else{
            title = path.charAt(0).toUpperCase() + path.slice(1)
        }
    }

    return (
        <div className="d-flex flex-column">
            <Header
                title={title && title.replace('-',' ')}
                background={`/media/${title && title.toLowerCase()}-banner.jpeg`}
            />
            <main className="mb-auto">
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
        </div>
    );
}

export default Layout;
