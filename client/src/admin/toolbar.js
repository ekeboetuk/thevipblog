import { useContext } from 'react';

import { Link } from "react-router-dom";

import { userContext } from '../index';

function Toolbar() {
	const {token, unsetToken} = useContext(userContext)
    return (
        <>
            <div className="d-inline-flex flex-column me-auto ps-4 ps-md-0">
                <Link to="/" target="_blank"><img src="/assets/logo-white.png" width={100} alt="logo" /></Link>
                <Link to="/" className="align-self-center fs-8 text-white">Visit Website <i class="fa-solid fa-arrow-up-right-from-square"></i></Link>
            </div>
            <Link type="button" className="d-none d-md-block text-white fs-8" title="Click to logout" onClick={unsetToken}><i className="fas fa-circle-user me-2"></i>{token?.name}</Link>
        </>
    )
}

export default Toolbar