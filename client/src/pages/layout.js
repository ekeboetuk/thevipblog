import { useState, useEffect } from "react"
import { Outlet, useSearchParams } from "react-router-dom";

import { ErrorBoundary } from "../components/errors";
import Header from "../components/header";
import Footer from "../components/footer";

function Layout() {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const user = searchParams.get("user")?.split(".").join(" ");
    const profile = searchParams.get("q")?.split(".").join(" ");
    const [title, setTitle] = useState()
    const [pathname, setPathname] = useState();
    const path = window.location.pathname.replace("/", "")

    useEffect(()=>{
        if (category) {
            setTitle(category.charAt(0).toUpperCase() + category.slice(1));
            setPathname(title?.toLowerCase());
        } else if (user) {
            setTitle(user.charAt(0).toUpperCase() + user.slice(1));
            setPathname("user");
        } else if (profile) {
            setTitle(profile.charAt(0).toUpperCase() + profile.slice(1));
            setPathname("profile");
        } else {
            if(path==='about'||path==='contact'||path==='newpost'){
                setTitle(path)
                setPathname(path);
            }else{
                setTitle(null)
            }
        }
    },[category, path, profile, title, user])

    return (
        <>
            <Header
                title={title}
                background={`/media/${pathname}-banner.jpeg`}
            />
            <ErrorBoundary>
                <main>
                    <Outlet />
                </main>
            </ErrorBoundary>
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
