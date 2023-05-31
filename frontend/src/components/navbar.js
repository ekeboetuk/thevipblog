//import { MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit'
import logo from '../images/logo.png'
import '../styles.css'

function Navbar() {
  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light square border-top border-primary border-3">
        <div className="container-md mx-auto">
            <a className="navbar-brand me-5 me-sm-0" href="/">
                <img
                    src={logo}
                    width="140"
                    height="40"
                    alt="Afriscope logo"
                />
            </a>
            <div className="navbar-nav navbar-collapse collapse justify-content-center" id="navigation-bar">
                <a className="nav-link ps-0 pe-4" aria-current="page" href="/">Home</a>
                <a className="nav-link ps-0 pe-4" href="/lifestyle">Lifestyle</a>
                <a className="nav-link ps-0 pe-4" href="/sports">Sports</a>
                <a className="nav-link ps-0 pe-4" href="fashions">Fashion</a>
                <a className="nav-link ps-0 pe-4" href="/about">About</a>
                <a className="nav-link ps-0 pe-4" href="/contact">Contact</a>
            </div>
            <div className="d-flex justify-content-end align-items-center">
                <i className="fas fa-search"></i>
                <button
                    className="navbar-toggler pe-1"
                    type="button"
                    data-mdb-toggle="collapse"
                    data-mdb-target="#navigation-bar"
                    aria-controls="navigation-bar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i className="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;