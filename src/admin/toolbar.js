import { useContext } from 'react';

import { Link } from "react-router-dom";

import { userContext } from '../index';

function Toolbar() {
	const {token, unsetToken} = useContext(userContext)
    return (
        <>
            <div className="d-inline-flex flex-column me-auto ps-4 ps-md-0">
                <Link to="/"><img src="/assets/logo-white.png" width={100} alt="logo" /></Link>
                <Link to="/" target="_blank" className="align-self-center text-white fs-6">Visit Website <i className="fa-solid fa-arrow-up-right-from-square"></i></Link>
            </div>
            <Link type="button" className="d-none d-md-block text-white" title="Click to logout" onClick={unsetToken}><i className="fas fa-circle-user me-2"></i>Logout {token?.name}</Link>
        </>
    )
}

export default Toolbar