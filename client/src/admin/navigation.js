import { Link } from 'react-router-dom'

function Navigation() {
    return (
        <div className="navbar-nav d-flex flex-column flex-fill">
            <Link to="/afriscope-admin" className="d-block fw-bold" aria-current="page"><i className='bx bxs-grid-alt'></i> Dashboard</Link>
            <Link to="#userMenu" className="d-block fw-bold" data-bs-toggle="collapse"><i className='fa-solid fa-circle-user'></i> Users </Link>
                <div id="userMenu" className="collapse fs-8 fw-bold" style={{backgroundColor: "#996984"}}>
                    <Link to="/afriscope-admin/users" className="d-block ps-5 fw-bold"><i className='fas fa-users-gear'></i> Manage Users</Link>
                    <Link to="/afriscope-admin/newuser" className="d-block ps-5 fw-bold"><i className='fas fa-user-plus'></i> Create User</Link>
                </div>
            <Link to="#postMenu" className="d-block fw-bold" data-bs-toggle="collapse"> <i className='bx bxs-message-square-detail'></i> Posts </Link>
                <div id="postMenu" className="collapse fs-8 fw-bold" style={{backgroundColor: "#996984"}}>
                    <Link to="/afriscope-admin/posts" className="d-block ps-5 fw-bold"><i className='bx bxs-notepad'></i> Manage Posts</Link>
                    <Link to="/afriscope-admin/comments" className="d-block ps-5 fw-bold"><i className='fa-solid fa-comments'></i> Manage Comments</Link>
                    <Link to="/afriscope-admin/newpost" className="d-block ps-5 fw-bold"><i className='fa-solid fa-file-pen'></i> Create Post</Link>
                </div>
            <Link to="#settingsMenu" className="d-block fw-bold" data-bs-toggle="collapse"> <i className='bx bxs-cog'></i> Settings </Link>
                <div id="settingsMenu" className="collapse fs-8 fw-bold" style={{backgroundColor: "#996984"}}>
                    <Link to="/afriscope-admin/settings" className="d-block ps-5 fw-bold"><i className='fas fa-gears'></i> General</Link>
                    <Link to="/afriscope-admin/settings/dashboard" className="d-block ps-5 fw-bold"><i className='bx bxs-dashboard'></i> Dashboard</Link>
                    <Link to="/afriscope-admin/settings/profile" className="d-block ps-5 fw-bold"><i className='fas fa-user-gear'></i> Profile</Link>
                </div>
        </div>
    )
}

export default Navigation;