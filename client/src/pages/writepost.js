import React from 'react';

import RecentPosts from '../components/recentpost'
import { Postform } from '../components/forms';
import { Error } from '../components/errors';
import Sidebar from '../components/widgets'


function WritePost( {token} ) {
    return (
        <>
            {token && token?.type!== "Subscriber" ?
                <>
                    <section className="container-md d-flex flex-column flex-md-row">
                        <div className="bg-tertiary px-3 px-md-5 rounded-5" style={{maxWidth: '768px'}}>
                            <Postform token={token}/>
                        </div>
                        <div className="align-self-start mx-0 mx-md-4 w-100 w-md-25">
                            <Sidebar advertise={true} subscribe={true} />
                        </div>
                    </section>
                    <section className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                        <div className="container-md">
                            <h4 className=" text-center text-uppercase text-white fw-bold mb-5 mx-md-3">Most Recent</h4>
                            <RecentPosts number={3} showMeta={true}/>
                        </div>
                    </section>
                </>:
                <Error status="401" token={token} />
            }
        </>
    )
}

export default WritePost;