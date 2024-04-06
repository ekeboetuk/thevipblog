import { useEffect } from 'react';

import { PostsCarousel } from '../components/carousels';
import { Postform } from '../components/forms';
import { Error } from '../components/errors';
import { Subscribe} from '../components/widgets'

function WritePost( {token} ) {

    useEffect(()=>{
        document.title = `Afriscope Blog - New Post`
    },[])

    return (
        <>
            {token && token?.role!== "Subscriber" ?
                <>
                    <section className="container-md d-flex flex-column flex-md-row">
                        <div className="col-12 col-md-9 bg-tertiary p-2 px-md-4 mb-4 me-md-4 rounded-5 align-self-start" style={{maxWidth: '768px'}}>
                            <Postform token={token}/>
                        </div>
                        <div className="col-12 col-md-3 align-self-start">
                            <Subscribe />
                        </div>
                    </section>
                    <section className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                        <PostsCarousel count={4} limit={4} autoplay={true} continous={true} />
                    </section>
                </>:
                <Error status="401" token={token} />
            }
        </>
    )
}

export default WritePost;