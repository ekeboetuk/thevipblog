import React from 'react';

import RecentPosts from '../components/recentpost'
import Postform from '../components/postform';
import { Error } from '../components/errors';

function NewPost( {token} ) {

    return (
            token && token?.type!== "Subscriber" ?
            <>
                {/**<div className="container-fluid mx-auto text-center fw-bold fs-5 py-4 bg-tertiary">
                    <img src="/assets/icon.png" alt="afriscope icon" className="py-2" />
                    <p>NEW POST</p>
                </div>**/}
                <div className="container-sm">
                    <div className="bg-tertiary my-4 px-3 px-md-5 py-4 rounded-5">
                        <Postform token={token}/>
                    </div>
                </div>
                <div className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                    <div className="container-md py-5">
                        <h6 className=" text-center text-uppercase text-white fw-bold mb-0 mx-md-3">Most Recent</h6>
                        <RecentPosts number={3} />
                    </div>
                </div>
            </>:
            <Error status="401" token={token} />
    )
}

export default NewPost;