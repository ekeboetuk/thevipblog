import { useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

import Main, { User } from './navigations';

export default function Header({title, background} ) {
  return (
    <>
    {/** Navigation Bar */}
      <div id="navbar" className="sticky-top">
        <Navbar />
      </div>
      {/** Page Banner & Title */}
      {["sports","lifestyles","fashion","technology","education","general","about us","contact us","profile","write post"].includes(title) &&
        <div className="container-fluid mx-auto fw-bold px-0 position-relative" style={{backgroundImage: `url(${background?background:'/media/about-us-banner.jpeg'})`, backgroundSize: 'cover', backgroundPosition: 'center center'}}>
          <div className="bg-primary opacity-50" style={{padding: '80px 0px'}}>
          </div>
          {/** Breadcrumbs */}
          {!["profile"].includes(title) &&
            <div id="page-title">
              <h4 className="display-4 fw-semibold text-white">{title && title}</h4>
              <small className="text-white" style={{textTransform:"capitalize"}}><NavLink className="text-white" to="/">home </NavLink><i className="fa-solid fa-angles-right"></i> {title}</small>
            </div>
          }
        </div>
      }
    </>
  );
}

export function Navbar() {
  const [searchterm, setSearchterm] = useState("");
  const searchform = useRef()
  const navigate = useNavigate()

  const handleChange = (e) => {
      setSearchterm(e.target.value)
  }

  return (
      <nav className="navbar navbar-expand-lg border-bottom border-primary border-3 py-0">
          <div className="container-fluid mx-auto px-4 py-4 py-md-0 align-items-start">
              <NavLink className="navbar-brand me-5 me-sm-0 pt-3" to="/">
                  <img
                      src="/assets/logo-white.png"
                      width={120}
                      alt="Afriscope logo"
                  />
              </NavLink>
              <div className="d-flex justify-content-end align-self-center">
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
                      <Main />
                  </div>
                  <div className="d-flex flex-row align-self-start py-3">
                    <div id="search" className="d-flex flex-grow-1 col-8 align-self-bottom position-relative justify-content-end px-4 pe-md-0">
                        <input type="search" ref={searchform} id="searchform" className="flex-fill border-0 rounded-4 ps-3 pe-5 me-2 fs-6 text-black-50" value={searchterm} onChange={(e)=>handleChange(e)} onKeyDown={(e) => {e.key === 'Enter' && searchterm.trim() !== "" && navigate(`search?${new URLSearchParams(`q=${searchterm}`)}`)}} placeholder='Instant Search' />
                        <div className="border-0 bg-transparent text-secondary position-absolute top-50 translate-middle ms-n4" role="button" onClick={() => navigate(`search?${new URLSearchParams(`q=${searchterm}`)}`)}>{searchterm.trim() !== "" && <i className="fas fa-search pe-2"></i>}</div>
                    </div>
                    <User />
                  </div>
              </div>
          </div>
      </nav>
  );
}