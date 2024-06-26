import React from "react";
import { Outlet, useParams } from "react-router-dom";

import { ErrorBoundary } from "../components/errors";
import Header from "../components/header";
import Footer from "../components/footer";

function Layout() {
    const slug = useParams().slug
    const path = useParams().category
    let title
    if(!path) {
        title= document.location.pathname.replace('/','')
    }else{
        if(slug){
            title = null
        }else{
            title = path
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
        </div>
    );
}

export default Layout;
