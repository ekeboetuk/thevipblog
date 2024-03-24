//import { ScrollRestoration } from 'react-router-dom';

import { useEffect } from 'react';
import Carousel from '../components/carousel';
import { Postcard } from '../components/cards';
import { Error } from '../components/errors'

import { usePosts } from '../hooks/fetchers';


function Home() {
    useEffect(()=>{
        document.title = "Afriscope - Your Favourite Blog - Homepage"
    })

    const {posts, error, isLoading} = usePosts('?sort=-_id')
    let content

    if(isLoading){
        content = null
    } else if(posts) {
        const home = posts?.filter((post) => post.isApproved && post.meta.featured)
        if(home.length === 0) {
            content = <Error status="204" document="Featured Post" />
        } else {
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
                    showCategory={true}
                    showMeta={true}
                    showReadmore={false}
                    showEngagement={true}
                    />
                </div>
            ))
        }
    } else if(error || error === undefined) {
            content = <Error status="500" />
    }

    return (
        <>
            <Carousel />
            <section className={`container-md position-relative`}>
                {/*posts && <h4 className="text-center pb-4 fw-bold">FEATURED POSTS</h4>*/}
                {isLoading &&
                    <div className="text-center">
                        <img src="/assets/spinner_block.gif" className="my-5 py-5" width="60px" alt="loading" />
                    </div>
                }
                <div className={`${isLoading && "opacity-25"}`}>
                    {content}
                </div>
            </section>
        </>

    )
}

export default Home