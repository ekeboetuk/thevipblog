import React from 'react';

import Postform from '../components/postform';
import { Error } from '../components/errors';

function NewPost( {token} ) {

    return (
            token && token?.type!== "Subscriber" ?
            <>
                <div className="container-fluid mx-auto text-center fw-bold fs-5 py-4 bg-tertiary">
                    <img src="/assets/icon.png" alt="afriscope icon" className="py-2" />
                    <p>NEW POST</p>
                </div>
                <div className="container-sm">
                    <div className="bg-tertiary my-4 px-3 px-md-5 py-4 rounded-5">
                        <Postform token={token}/>
                    </div>
                </div>
            </>:
            <Error status="401" token={token} />
    )
}

export default NewPost;