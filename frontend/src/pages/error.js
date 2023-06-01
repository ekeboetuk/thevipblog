import { Link } from 'react-router-dom';

function Error() {
    return (
        <div className="container-md text-center my-5 py-5">
            <h1 className="fs-1 fw-semibold text-brand">404</h1>
            <h5 className="fw-semibold">Page not found</h5>
            <p>Oops! The page you are looking for does not exist. it might have been moved or deleted</p>
            <Link className="text-white btn-primary rounded-9 px-3 pt-2 pb-1 fw-semibold" to="/" type="button"><i className="fas fa-home pe-2"></i>Back to home</Link>
        </div>
    )
}

export default Error;