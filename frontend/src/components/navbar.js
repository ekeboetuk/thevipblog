import { useState, useRef } from 'react'
import { Link } from 'react-router-dom';

function Navbar() {
const [search, setSearch] = useState(false);
const [searchterm, setSearchterm] = useState();
const searchform = useRef();

    const handleClick = () => {
        setSearch(!search);
        setTimeout(()=> {
        searchform.current.focus();
        document.getElementById("searchform").addEventListener("blur", ()=> setSearch(false));
        }, 500)
    }

    const handleSearch = () => {

    }

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light square border-top border-primary border-3">
        <div className="container-md mx-auto">
            <Link className="navbar-brand me-5 me-sm-0" to="/">
                <img
                    src="/assets/logo.png"
                    width="140"
                    height="40"
                    alt="Afriscope logo"
                />
            </Link>
            <div className="d-flex justify-content-end align-items-center">
                <button
                    className="navbar-toggler pe-1 ms-2"
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
                    <Link className="nav-link ps-0 pe-4" to="/about">About</Link>
                    <Link className="nav-link ps-0 pe-4" to="/contact">Contact</Link>
                </div>
                <div className="align-self-bottom">
                    {search &&
                        <div id="search" className="position-relative"><input type="text" ref={searchform} size={25} id="searchform" className="rounded-pill ps-3 pe-5 pt-2 pb-1 fs-8" value={searchterm} onChange={e=>setSearchterm(e.target.value)}/>
                        <button className="border-0 bg-transparent text-secondary" onClick={handleSearch}><i className="fas fa-search position-absolute top-50 translate-middle ms-n4"></i></button>
                        </div>
                    }
                    {!search && <button className="border-0 bg-transparent text-secondary ps-3 align-bottom" onMouseOver={handleClick}><i className="fas fa-search"></i></button>}
                </div>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;