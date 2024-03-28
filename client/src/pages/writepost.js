import React from 'react';

import { PostsCarousel } from '../components/carousels';
import { Postform } from '../components/forms';
import { Error } from '../components/errors';
import Sidebar from '../components/widgets'

function WritePost( {token} ) {
    return (
        <>
            {token && token?.type!== "Subscriber" ?
                <>
                    <section className="container-md d-flex flex-column flex-md-row">
                        <div className="bg-tertiary px-3 px-md-5 py-2 rounded-5 align-self-start" style={{maxWidth: '768px'}}>
                            <Postform token={token}/>
                        </div>
                        <div className="align-self-start mx-0 mx-md-4 w-100 w-md-25">
                            <Sidebar advertise={true} subscribe={true} />
                        </div>
                    </section>
                    <section className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                        <PostsCarousel count={3} limit={4} title="Most Recent" />
                    </section>
                </>:
                <Error status="401" token={token} />
            }
        </>
    )
}

export default WritePost;