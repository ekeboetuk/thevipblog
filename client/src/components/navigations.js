import { useState, useContext } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"

import axios from "axios"

import { userContext } from ".."

export default function Main(){
    return(
        <>
            <NavLink preventScrollReset={true} className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/"><i className="fa-solid fa-house pe-2"></i><span className="fs-6">Home</span></NavLink>
            <NavLink preventScrollReset={true} className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/lifestyles"><i className="fa-solid fa-headset pe-2"></i><span className="fs-6">Lifestyles</span></NavLink>
            <NavLink preventScrollReset={true} className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/sports"><i className="fa-solid fa-dumbbell pe-2"></i><span className="fs-6">Sports</span></NavLink>
            <NavLink preventScrollReset={true} className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/fashion"><i className="fa-solid fa-hat-cowboy pe-2"></i><span className="fs-6">Fashion</span></NavLink>
            <NavLink preventScrollReset={true} className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/technology"><i className="fa-solid fa-microchip pe-2"></i><span className="fs-6">Technology</span></NavLink>
            <NavLink preventScrollReset={true} className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/about-us"><i className="fa-solid fa-address-card pe-2"></i><span className="fs-6">About</span></NavLink>
            <NavLink preventScrollReset={true} className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3" to="/contact-us"><i className="fa-solid fa-envelope-open-text pe-2"></i><span className="fs-6">Contact</span></NavLink>
            <NavLink preventScrollReset={true} className="d-flex flex-row flex-md-column align-items-center nav-link px-3 py-3 mt-5 mt-md-0 ms-md-5" to="/community"><i className="fa-solid fa-layer-group pe-2"></i><span className="fs-6">Community</span></NavLink>
        </>
    )
}

export function User() {
	const [usermenu, showUsermenu] = useState(false)
	const {token, unsetToken} = useContext(userContext)
	const navigate = useNavigate()

    function handleClick () {
        showUsermenu(!usermenu)
        document.addEventListener('click', e => {
            if (e.target.nodeName !== 'BUTTON' && e.target.nodeName !== 'IMG' && e.target.nodeName !== 'I') showUsermenu(false);
          });
    }

	async function administrator() {
		await axios.get(process.env.REACT_APP_SERVER_URL + '/user/auth', {
			withCredentials: true
		})
		.then(()=>{
			navigate('/administrator/posts')
		})
		.catch((err)=>{
			unsetToken()
			navigate("/login",{state: {message: `${err.response.data} Please re-login to continue!`}});
		})
	}

	return (
		<>
			{token ?
				<>
					<div id="user" className="d-flex justify-content-end" onClick={handleClick}>
						<button className={`border border-primary bg-primary rounded-pill d-flex flex-fill text-white justify-content-between align-items-center fw-bold px-1`} style={{fontSize: '70%', fontWeight: '800'}} data-mdb-ripple-duration="2s">
                            <img src={`${token.avatar || "/assets/icon-white.webp"}`} role="button" className="me-2 rounded-circle" height={30} width={30} alt="icon" style={{objectFit: "cover"}}/>
							<i role="button" className="fas fa-circle-chevron-down fa-lg lh-1"></i>
						</button>
						{usermenu &&
							<div id="usermenu" className="d-flex flex-column position-absolute top-100 end-0 bg-tertiary actionmenu shadow-sm">
								<Link to={`/profile?q=${token.name.split(' ').join('.').toLowerCase()}`} className="menuitem link-dark"><li className="fas fa-address-card me-2"></li>My Profile</Link>
								{token?.role !== 'Subscriber' &&
									<>
										<Link className="menuitem link-dark" to="/write-post"><i className="fa-solid fa-keyboard me-2"></i>Write Post</Link>
									</>
								}
								{token?.isAdmin && <div onClick={administrator} className="menuitem link-dark" role="button"><li className="fa-solid fa-toolbox me-2"></li>Administrator</div>}
								<div className="menuitem link-dark" role="button" onClick={unsetToken}><li className="fa-solid fa-lock-open me-2"></li>Sign Out</div>
							</div>}
					</div>
				</> :
				<Link className="text-white border border-primary rounded-pill px-3 py-2 fs-6" to="/login" role="button">
					<i className="fa-solid fa-unlock-keyhole me-2"></i>
					Login
				</Link>
			}
		</>
	);
}