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
                        <div className="bg-tertiary px-3 px-md-5 py-2 rounded-5 align-self-start" style={{maxWidth: '768px'}}>
                            <Postform token={token}/>
                        </div>
                        <div className="align-self-start ps-md-4 w-100 w-md-25">
                            <Subscribe />
                        </div>
                    </section>
                    <section className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                        <PostsCarousel count={3} limit={4} autoplay={true} continous={false} />
                    </section>
                </>:
                <Error status="401" token={token} />
            }
        </>
    )
}

export default WritePost;