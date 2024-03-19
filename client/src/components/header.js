import { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom';

import { UserMenu } from './users';

export default function Header({title, background} ) {
  return (
    <>
      <div id="navbar" className="sticky-top">
        <Navbar />
      </div>
      {title &&
        <div className="container-fluid mx-auto fw-bold px-0 position-relative" style={{backgroundImage: `url(${background?background:'/media/about-banner-1.jpeg'})`, backgroundSize: 'cover', backgroundPosition: 'center center'}}>
          <div className="bg-primary opacity-50" style={{padding: '80px 0px'}}>
          </div>
          <div id="page-title">
            <h4 className="display-4 fw-semibold text-white text-uppercase">{title && title}</h4>
            <small className="text-white" style={{textTransform:"capitalize"}}><NavLink className="text-white" to="/">home </NavLink><i className="fa-solid fa-angles-right"></i> {title}</small>
          </div>
        </div>
      }
    </>
  );
}

export function Navbar() {
  const [searchterm, setSearchterm] = useState();
  const searchform = useRef();

  const handleSearch = ( ) => {

  }

  return (
      <nav className="navbar navbar-expand-lg border-bottom border-primary border-3 py-0">
          <div className="container-fluid mx-auto px-4 py-4 py-md-0">
              <NavLink className="navbar-brand me-5 me-sm-0" to="/">
                  <img
                      src="/assets/logo-white.png"
                      width={120}
                      alt="Afriscope logo"
                  />
              </NavLink>
              <div className="d-flex justify-content-end align-items-center">
                  <button
                      className="navbar-toggler ms-2 text-white"
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
                  <div className="navbar-nav flex-grow-1 justify-content-center mb-4 mb-md-0">
                      <NavLink className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/"><i className="fa-solid fa-house pe-2"></i><span className="fs-6">Home</span></NavLink>
                      <NavLink className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/lifestyles"><i className="fa-solid fa-headset pe-2"></i><span className="fs-6">Lifestyles</span></NavLink>
                      <NavLink className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/sports"><i className="fa-solid fa-dumbbell pe-2"></i><span className="fs-6">Sports</span></NavLink>
                      <NavLink className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/fashion"><i className="fa-solid fa-hat-cowboy pe-2"></i><span className="fs-6">Fashion</span></NavLink>
                      <NavLink className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/technology"><i className="fa-solid fa-microchip pe-2"></i><span className="fs-6">Technology</span></NavLink>
                      <NavLink className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/about-us"><i className="fa-solid fa-address-card pe-2"></i><span className="fs-6">About</span></NavLink>
                      <NavLink className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/contact-us"><i className="fa-solid fa-envelope-open-text pe-2"></i><span className="fs-6">Contact</span></NavLink>
                  </div>
                  <div id="search" className="d-flex align-self-bottom position-relative justify-content-end px-4 pe-md-0">
                      <input type="search" ref={searchform} id="searchform" className="flex-fill border-0 rounded-pill ps-3 pe-5 py-1 fs-7 text-black-50" value={searchterm} onChange={e=>setSearchterm(e.target.value)} placeholder='Search posts'/>
                      <button className="border-0 bg-transparent text-secondary position-absolute top-50 translate-middle ms-n4" onClick={handleSearch} ><i className="fas fa-search"></i></button>
                  </div>
                  <div className="pt-2 pt-md-0 justify-content-end px-4 pe-md-0">
                      <UserMenu />
                  </div>
              </div>
          </div>
      </nav>
  );
}