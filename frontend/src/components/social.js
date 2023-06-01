import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { userContext } from '../index';

function Social( ) {
	const [usermenu, showUsermenu] = useState(false)
	const {user, token, unsetToken} = useContext(userContext)

	function handleLogout() {
		unsetToken();
	}

	return (
		<div className="bg-primary py-3 text-light">
			<div className="row container-md mx-auto">
				<div className="col-12 col-md-7 d-flex justify-content-center justify-content-md-end align-items-center">
					<a className="text-light" href="https://f.me/afriscope">
						<i className="fab fa-facebook-f fa-lg pe-4 pe-md-5"></i>
					</a>
					<a className="text-light" href="https://t.me/afriscope">
						<i className="fab fa-twitter fa-lg pe-4 pe-md-5"></i>
					</a>
					<a className="text-light" href="https://i.me/afriscope">
						<i className="fab fa-instagram fa-lg pe-4 pe-md-5"></i>
					</a>
					<a className="text-light" href="https://yt.me/afriscope">
						<i className="fab fa-youtube fa-lg pe-4 pe-md-4"></i>
					</a>
				</div>
				<div className='col-12 col-md-5 mt-3 mt-md-0 d-flex justify-content-center justify-content-md-end align-items-center'>
					{token ?
						<>
							<Link className="btn text-white me-4 rounded-0" to="/newpost" role="button">
								<i className="fas fa-edit me-2"></i>
								Create Post
							</Link>
							<div className="position-relative" onMouseOver={()=>showUsermenu(true)} onMouseOut={()=>showUsermenu(false)}>
								<button className={`btn text-white ${usermenu && "bg-secondary"} rounded-0`}>
									{user?.name}
									<i className="fas fa-square-caret-down ms-3"></i>
								</button>
								{usermenu &&
									<div id="usermenu" className="d-flex flex-column position-absolute top-100 start-0 w-100 bg-tertiary">
										<Link to="/profile" className="menuitem link-dark"><li className="fas fa-user me-2"></li>My Profile</Link>
										<Link to={`/posts?${user.name}`} className="menuitem link-dark"><li className="fas fa-edit me-2"></li>My Posts</Link>
										{user.isAdmin && <Link to="/administrator" className="menuitem link-dark"><li className="fas fa-unlock me-2"></li>Admin Panel</Link>}
										<Link className="menuitem link-dark" onClick={handleLogout}><li className="fas fa-unlock me-2"></li>Sing Out</Link>
									</div>}
							</div>
						</> :
						<Link className="btn box-shadow--3dp text-white" to="/signin" role="button">
							<i className="fas fa-user me-2"></i>
							Sign Up/Sign In
						</Link>
					}
				</div>
			</div>
		</div>
	);
}

export default Social;