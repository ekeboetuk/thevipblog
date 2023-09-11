import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { userContext } from '../index';

function Social( ) {
	const [usermenu, showUsermenu] = useState(false)
	const {token, unsetToken} = useContext(userContext)

	function handleLogout() {
		unsetToken();
	}

	return (
		<div id="socialbar" className="bg-tertiary py-2 text-light">
			<div className="row container-md mx-auto">
				<div className="col-12 col-md-7 d-flex justify-content-center justify-content-md-end align-items-center">
					<a className="text-light" href="https://f.me/afriscope">
						<i className="fa-brands fa-facebook fa-lg pe-4 pe-md-5"></i>
					</a>
					<a className="text-light" href="https://t.me/afriscope">
						<i className="fa-brands fa-twitter fa-lg pe-4 pe-md-5"></i>
					</a>
					<a className="text-light" href="https://i.me/afriscope">
						<i className="fa-brands fa-instagram fa-lg pe-4 pe-md-5"></i>
					</a>
					<a className="text-light" href="https://yt.me/afriscope">
						<i className="fa-brands fa-youtube fa-lg"></i>
					</a>
				</div>
				<div className='col-12 col-md-5 mt-3 mt-md-0 d-flex justify-content-center justify-content-md-end align-items-center'>
					{token ?
						<>
							{token.type!== "Subscriber" && <Link className="btn d-flex text-white fw-bold me-4 border border-primary rounded-0" to="/post/newpost" role="button">
								<i className="bx bx-notepad me-2 fs-6"></i>
								Create Post
							</Link>}
							<div className="position-relative" onClick={()=>showUsermenu(!usermenu)}>
								<button className={`btn d-flex justify-content-between text-white border border-primary ${usermenu && "bg-secondary"} rounded-0 fw-bold`}>
									Hi, {token?.name.split(" ")[0]}!
									<i className="fas fa-circle-chevron-down fa-lg lh-1 ms-1"></i>
								</button>
								{usermenu &&
									<div id="usermenu" className="d-flex flex-column position-absolute top-100 start-0 w-100 bg-tertiary actionmenu">
										<Link to="/profile" className="menuitem link-dark"><li className="fas fa-user me-2"></li>My Profile</Link>
										<Link to={`/posts?${token?.name}`} className="menuitem link-dark"><li className="fas fa-edit me-2"></li>My Posts</Link>
										{token?.isAdmin && <Link to="/afriscope-admin" className="menuitem link-dark"><li className="fas fa-gear me-2"></li>Admin Panel</Link>}
										<Link className="menuitem link-dark" onClick={handleLogout}><li className="fas fa-unlock me-2"></li>Sign Out</Link>
									</div>}
							</div>
						</> :
						<Link className="btn text-white border border-primary" to="/signin" role="button">
							<i className="fas fa-right-to-bracket me-2"></i>
							Sign Up/Sign In
						</Link>
					}
				</div>
			</div>
		</div>
	);
}

export default Social;