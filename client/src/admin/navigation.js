import { Link } from 'react-router-dom'

function Navigation() {
    return (
        <div className="navbar-nav d-flex flex-column flex-fill">
            <Link to="/administrator" className="d-block fw-bold" aria-current="page"><i className='bx bxs-grid-alt'></i> Dashboard</Link>
            <Link to="#userMenu" className="d-block fw-bold" data-bs-toggle="collapse"><i className='fa-solid fa-circle-user'></i> Users </Link>
                <div id="userMenu" className="collapse fs-6 fw-bold" style={{backgroundColor: "#996984"}}>
                    <Link to="/administrator/users" className="d-block ps-5 fw-bold"><i className='fas fa-users-gear'></i> Manage Users</Link>
                    <Link to="/administrator/newuser" className="d-block ps-5 fw-bold"><i className='fas fa-user-plus'></i> Create User</Link>
                </div>
            <Link to="#postMenu" className="d-block fw-bold" data-bs-toggle="collapse"> <i className='bx bxs-message-square-detail'></i> Posts </Link>
                <div id="postMenu" className="collapse fs-6 fw-bold" style={{backgroundColor: "#996984"}}>
                    <Link to="/administrator/posts" className="d-block ps-5 fw-bold"><i className='bx bxs-notepad'></i> Manage Posts</Link>
                    <Link to="/administrator/comments" className="d-block ps-5 fw-bold"><i className='fa-solid fa-comments'></i> Manage Comments</Link>
                    <Link to="/administrator/newpost" className="d-block ps-5 fw-bold"><i className='fa-solid fa-file-pen'></i> Create Post</Link>
                </div>
            <Link to="#settingsMenu" className="d-block fw-bold" data-bs-toggle="collapse"> <i className='bx bxs-cog'></i> Settings </Link>
                <div id="settingsMenu" className="collapse fs-6 fw-bold" style={{backgroundColor: "#996984"}}>
                    <Link to="/administrator/settings" className="d-block ps-5 fw-bold"><i className='fas fa-gears'></i> General</Link>
                    <Link to="/administrator/settings/dashboard" className="d-block ps-5 fw-bold"><i className='bx bxs-dashboard'></i> Dashboard</Link>
                    <Link to="/administrator/settings/profile" className="d-block ps-5 fw-bold"><i className='fas fa-user-gear'></i> Profile</Link>
                </div>
        </div>
    )
}

export default Navigation;