import { Outlet } from "react-router-dom";

import Toolbar from '../admin/toolbar';
import Navigation from '../admin/navigation';
import Copyright from '../components/copyright';

import { ErrorBoundary } from '../components/errors';
import { Statistics, RecentUser, LatestPost, Trending } from '../components/widgets';

function Administrator() {
    const toggleUtilbar = () => {
        document.getElementById("contentarea").classList.toggle("col-md-7")
        document.getElementById("contentarea").classList.toggle("col-md-10")
        document.getElementById("utilbar").classList.toggle("col-md-3")
        document.getElementById("utilbar").classList.toggle("col-d-0")
        document.getElementById("utilbar").classList.toggle("d-md-none")
        document.getElementById("toggler").classList.toggle("bxs-right-arrow")
        document.getElementById("toggler").classList.toggle("bxs-left-arrow")
    }
    return (
        <div className=" d-flex flex-column">
            <div id="toolbar" className="navbar navbar-expand-md container-fluid sticky-top d-flex flex-row align-items-center bg-primary border-bottom border-primary border-3 mx-auto px-md-4 pb-0">
                <Toolbar />
                <button
                className="navbar-toggler text-white pe-4 ms-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#adminnavigation"
                aria-controls="adminnavigation"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <i className="fas fa-bars"></i>
            </button>
                <div id="adminnavigation" className="col-2 navbar-collapse collapse p-0">
                    <Navigation />
                </div>
            </div>
            <div className="d-flex justify-content-start row mb-4" >
                <div className="d-none d-md-flex col-md-2 bg-primary shadow-sm" style={{minHeight: "88vh"}}>
                </div>
                <ErrorBoundary fallback={<div class="d-flex col-12 col-md-7 p-4">Something terrible happened, please refresh to try again</div>}>
                    <div id="contentarea" className="d-flex col-12 col-md-7 justify-content-center p-3 position-relative">
                        <Outlet />
                        <div type="button" className="toggler d-none d-md-flex align-items-center h-100 position-fixed top-0 end-0" onClick={toggleUtilbar}><i id="toggler" className="bx bxs-right-arrow text-brand"></i></div>
                    </div>
                    <div id="utilbar" className="col-12 col-md-3 ps-2 pe-3 py-3">
                        <Statistics />
                        <LatestPost />
                        <Trending />
                        <RecentUser />
                    </div>
                </ErrorBoundary>
            </div>
            <div className="fixed-bottom">
                <div className="position-fixed bottom-0 end-0 alert mb-2 me-3" id="alert" role="alert"></div>
                <Copyright />
            </div>
        </div>
    )
}

export default Administrator