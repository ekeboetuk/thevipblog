import React from 'react';
import { Link } from 'react-router-dom'

import NewPost from '../components/newpost';

function CreatePost( {token} ) {

    return (
            token && token?.type!== "Subscriber" ?
            <>
                <div className="container-fluid mx-auto text-center fw-bold fs-5 py-4 bg-tertiary">
                    <img src="/assets/icon.png" alt="afriscope icon" className="py-2" />
                    <p>NEW POST</p>
                </div>
                <div className="container-sm py-5">
                    <NewPost />
                </div>
            </>:
            <div className="container-md text-center my-5 py-5">
                <h1 className="fs-1 fw-semibold text-brand">403</h1>
                <h5 className="fw-semibold">Access Denied</h5>
                <p>Page is restricted to authorized users only. Please contact site Administrator!</p>
                <Link to="/signin" className="btn btn-primary rounded-0 fw-bold" role="button"><i className="fas fa-right-to-bracket me-2"></i>Sign In</Link>
            </div>
    )
}

export default CreatePost;