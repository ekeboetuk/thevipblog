import { useState, useRef } from 'react'
import { Link } from 'react-router-dom';

import { UserMenu} from './users';

function Navbar() {
    const [searchterm, setSearchterm] = useState();
    const searchform = useRef();

    const handleSearch = () => {

    }

    return (
        <nav className="navbar navbar-expand-lg border-top border-primary border-3 py-4">
            <div className="container-fluid mx-auto px-5">
                <Link className="navbar-brand mt-n3 me-5 me-sm-0" to="/">
                    <img
                        src="/assets/logo-white.png"
                        width={120}
                        alt="Afriscope logo"
                    />
                </Link>
                <div className="d-flex justify-content-end align-items-center">
                    <button
                        className="navbar-toggler pe-1 ms-2 text-white"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target="#mainnavigation"
                        aria-controls="mainnavigation"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                    <i className="fas fa-bars"></i>
                    </button>
                </div>
                <div className="navbar-collapse collapse" id="mainnavigation">
                    <div className="navbar-nav flex-grow-1 justify-content-center">
                        <Link className="nav-link ps-0 pe-4" aria-current="page" to="/">Home</Link>
                        <Link className="nav-link ps-0 pe-4" to="/posts/lifestyles">Lifestyles</Link>
                        <Link className="nav-link ps-0 pe-4" to="/posts/sports">Sports</Link>
                        <Link className="nav-link ps-0 pe-4" to="/posts/fashion">Fashion</Link>
                        <Link className="nav-link ps-0 pe-4" to="/posts/general">General</Link>
                        <Link className="nav-link ps-0 pe-4" to="/about">About</Link>
                        <Link className="nav-link ps-0 pe-4" to="/contact">Contact</Link>
                    </div>
                    <div className="align-self-bottom">
                        <div id="search" className="position-relative">
                            <input type="search" ref={searchform} size={25} id="searchform" className="border-0 rounded-pill ps-3 pe-5 py-1 fs-7 text-black-50" value={searchterm} onChange={e=>setSearchterm(e.target.value)} placeholder='Search posts'/>
                            <button className="border-0 bg-transparent text-secondary" onClick={handleSearch} ><i className="fas fa-search position-absolute top-50 translate-middle ms-n4"></i></button>
                        </div>
                    </div>
                    <UserMenu />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;