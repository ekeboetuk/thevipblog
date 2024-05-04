import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PostsCarousel } from '../components/carousels';
import { Postform } from '../components/forms';
import { Error } from '../components/errors';
import { Subscribe} from '../components/widgets'

function WritePost( {token} ) {
    const [action] = useSearchParams()

    useEffect(()=>{
        document.title = `Afriscope Blog - ${action.get("action")==="edit"?"Edit":"New"} Post`
        window.scrollTo({top:0,left:0,behavior:'smooth'})
    },[action])

    return (
        <>
            {token && token?.role!== "Subscriber" ?
                <>
                    <section className="container-md d-flex flex-column flex-md-row">
                        <div className="col-12 col-md-9 p-2 px-md-4 mb-4 me-md-4 rounded-5 align-self-start" style={{maxWidth: '768px', backgroundColor: 'rgba(116, 65, 93, 0.14)'}}>
                            <Postform token={token}/>
                        </div>
                        <div className="col-12 col-md-3 align-self-start">
                            <Subscribe />
                        </div>
                    </section>
                    <section className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                        <PostsCarousel count={4} limit={6} autoplay={true} continous={true} />
                    </section>
                </>:
                <Error status="401" token={token} />
            }
        </>
    )
}

export default WritePost;