//import { ScrollRestoration } from 'react-router-dom';

import Carousel from '../components/carousel';
import { Postcard } from '../components/cards';

import { usePosts } from '../hooks/fetchers';


function Home() {
    const [posts, isError, isLoading] = usePosts('s/')
    let content

    if(isLoading){
        content =
             <div className="text-center">
                 <img src="/assets/spinner_block.gif" className="my-5 py-5" width="60px" alt="loading" />
             </div>
    }else if(isError) {
        content =
            <div className="text-center">
                <img src="/media/no_post.png" width="50px" className="py-3" alt="nopost" />
                <h6 className="fw-bold">Currently unable to display posts under this category.</h6>
                <h6>Either it's empty or someone forgot to connect something. Please check back later. Thank you!</h6>
            </div>
    }else {
        const home = posts?.filter((post) => post.isApproved && post.meta.featured)
        content =
            home.map((post) => (
            <div key={post._id} className="d-flex flex-column flex-md-row mb-5">
                <Postcard
                id={post._id}
                slug={post.slug}
                image={post.image}
                title={post.title}
                intro={post.intro}
                comments={post.comments}
                category={post.meta.category}
                meta={post.meta}
                created={post.created}
                height="350px"
                />
            </div>
        ))
    }

    return (
        <>
            <Carousel />
            <div className="container-md py-5">
                <h2 className="text-center pb-4 fs-5 fw-bold">FEATURED POSTS</h2>
                {content}
            </div>
        </>

    )
}

export default Home