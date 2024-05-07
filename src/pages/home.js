import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

import { usePosts } from '../hooks/fetchers';
import axios from 'axios';

import Adverts from '../components/adverts';
import { Postcard, PostcardTransparent } from '../components/cards';
import { Advertise, Subscribe } from '../components/widgets'
import { Error } from '../components/errors';

function Home() {
    const {posts, error, loading} = usePosts(`/?sort=-_id`)
    const [quotes, setQuotes] = useState()
    const [count, setCount] = useState(4)
    const quote = useRef({quote: "Advertise you products here at an affordable rate", name: "Afriscope"})
    const qdcount = useRef(0)
    let content, approved, featured//, featured

    useEffect(()=>{
        document.title = "Afriscope - Your Contentful Blog - Homepage"
    },[])

    useEffect(()=>{
        (async function(){
            await axios.get("/assets/random-quotes.json")
            .then((res) => {
                setQuotes(res.data)
            })
        })()
    },[])

   useEffect(()=>{
        if(quotes?.length > 0){
            setInterval(()=>{
                if(qdcount.current === 5) {
                    quote.current = {quote: "Advertise you products here at an affordable rate", name: "Afriscope"}
                    return qdcount.current = 0
                }
                const n = Math.floor(Math.random()*quotes.length)
                quote.current = quotes[n]
                qdcount.current +=  1
            }, 10000)
        }
    },[quotes])

    if(loading) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        content =
            <div className="container-md row mx-auto p-4 p-md-0 my-5">
                <div className="d-flex gap-2">
                    <Skeleton width="5px" height="28px" baseColor="#EBEBEB"/>
                    <Skeleton width="100px" height="25px" baseColor="#FAFAFA"/>
                </div>
                <div className="col-12 col-md-8 pe-md-4 align-self-start">
                    <SkeletonTheme baseColor="#FAFAFA">
                        <Skeleton width="100%" height="265px"/>
                        <div className="p-4 mb-5"style={{backgroundColor: "#ebebeb", lineHeight: "1.8rem"}}>
                            <Skeleton width="80%" height="20px" className="mb-2"/>
                            <Skeleton count={5.2} width="100%" height="10px"/>
                        </div>
                    </SkeletonTheme>
                </div>
                <div className="col-12 col-md-4 ps-md-4">
                    <SkeletonTheme baseColor="#FAFAFA" containerClassName="mb-5">
                        <Skeleton width="100%" height="165px"/>
                        <div className="p-3 mb-3"style={{backgroundColor: "#ebebeb"}}>
                            <Skeleton count={2.7} width="100%" height="15px" />
                        </div>
                    </SkeletonTheme>
                    <div className="bg-tertiary p-3 mb-3" style={{backgroundColor: "#ebebeb", lineHeight: "1.8rem"}}>
                        <Skeleton  count ={1.8} width="100%" height="15px"/>
                        <Skeleton width="40%" height="15px" />
                    </div>
                    <div className="bg-tertiary p-3 mb-3 lh-2" style={{backgroundColor: "#ebebeb", lineHeight: "1.8rem"}}>
                        <Skeleton  count ={1.8} width="100%" height="15px"/>
                        <Skeleton width="40%" height="15px" />
                    </div>
                </div>
            </div>
    } else if(posts) {
        approved = posts.filter(post => post.isApproved)
        featured = approved.filter(post => post.meta.featured)
        approved.length === 0?
        content = <Error status="204" element="Just in time for the party. Subscribe to be the first to know ->" />:
        content =
            <>
                <section>
                <h3 className="container-md border-left fs-4">Featured Posts</h3>
                    {featured.length !== 0?
                        <div className="container-md mx-auto row row-col-2">
                            <div className={`col col-12 col-md-${featured.length>1?8:12} pe-md-4 mb-5 mb-md-0 align-self-stretch`}>
                                <PostcardTransparent
                                    id={featured[0]._id}
                                    slug={featured[0].slug}
                                    image={featured[0].image}
                                    height="450px"
                                    title={featured[0].title}
                                    intro={`${featured[0].intro.slice(0, 500)}...`}
                                    comments={featured[0].comments}
                                    meta={featured[0].meta}
                                    created={featured[0].created}
                                    showIntro={true}
                                    showMeta={true}
                                    showCategory={true}
                                    />
                            </div>
                                <div className="col col-12 col-md-4 ps-md-4">
                                    <div className="d-flex flex-column gap-4">
                                    {featured.length > 1 &&
                                        <PostcardTransparent
                                            id={featured[1]._id}
                                            slug={featured[1].slug}
                                            image={featured[1].image}
                                            height="250px"
                                            title={featured[1].title}
                                            intro={`${featured[1].intro.slice(0, 500)}...`}
                                            comments={featured[1].comments}
                                            meta={featured[1].meta}
                                            created={featured[1].created}
                                            showCategory={true}
                                            showMeta={true}
                                        />
                                    }

                                    {featured.length > 2 &&
                                        <Postcard
                                            id={featured[2]._id}
                                            slug={featured[2].slug}
                                            title={featured[2].title}
                                            comments={featured[2].comments}
                                            category={featured[2].meta.category}
                                            meta={featured[2].meta}
                                            created={featured[2].created}
                                            height="100px"
                                            showCategory={true}
                                            showMeta={false}
                                            showReadmore={false}
                                            showEngagement={false}
                                            font="1.8rem"
                                        />
                                    }
                                    {featured.length > 3 &&
                                        <Postcard
                                            id={featured[3]._id}
                                            slug={featured[3].slug}
                                            title={featured[3].title}
                                            comments={featured[3].comments}
                                            category={featured[3].meta.category}
                                            meta={featured[3].meta}
                                            created={featured[3].created}
                                            height="100px"
                                            showCategory={true}
                                            showMeta={false}
                                            showReadmore={false}
                                            showEngagement={false}
                                        />
                                    }
                                </div>
                            </div>
                        </div>:
                        <p className='container-md'>You are all caught up here. Enjoy other selections.</p>
                    }
                </section>
                <section className="container-fluid smooth" style={{backgroundColor: 'rgba(88, 88, 88, 0.1)'}}>
                    <div className="container-md mx-auto row justify-content-center">
                        <div className="col-12 col-md-4 order-md-2 ps-md-4">
                            <Advertise title="Look Here" content={quote.current} />
                            <div className="sticky-top mb-5 mb-md-4" style={{top: "60px", zIndex: "0"}}>
                                <Subscribe />
                            </div>
                        </div>
                        <h3 className="col-12 border-left fs-4">Just In</h3>
                        <div className="col-12 col-md-8 row row-cols-1 row-cols-md-2 pe-0">
                            {approved.slice(0,count).map((post) => (
                                <div key={post._id} className="col pe-md-4
                                pb-4 align-self-start transition">
                                    <PostcardTransparent
                                    id={post._id}
                                    slug={post.slug}
                                    image={post.image}
                                    height="300px"
                                    title={post.title}
                                    intro={`${post.intro.slice(0, 500)}...`}
                                    comments={post.comments}
                                    meta={post.meta}
                                    created={post.created}
                                    showFeatured={false}
                                    showMeta={true}
                                    />
                                </div>
                            ))}
                        </div>
                        {approved.length > count && <button className="col-12 btn btn-primary fw-bolder order-md-last" onClick={()=>setCount(count+2)}>Load More</button>}
                    </div>
                </section>
                <section id="popular-categories" className="container-fluid mx-auto">
                    <h3 className="container-md border-left fs-4">Popular Categories</h3>
                    <div className="container-md d-flex flex-column flex-md-row">
                        <div className="d-flex row row-cols-1 row-cols-md-3">
                            <Link to="/technology" className="col d-flex flex-column position-relative mb-4 pe-md-4">
                                <img src="/media/technology-banner.jpeg" style={{objectFit: "cover", width: "100%", height: "150px"}} alt="Technology" />
                                <h1 className="position-absolute top-50 start-50 translate-middle text-uppercase text-white">Technology</h1>
                            </Link>
                            <Link to="/fashion" className="col d-flex flex-column position-relative mb-4 pe-md-4">
                                <img src="/media/fashion-banner.jpeg" style={{objectFit: "cover", width: "100%", height: "150px"}} alt="Fashion" />
                                <h1 className="position-absolute top-50 start-50 translate-middle text-uppercase text-white">Fashion</h1>
                            </Link>
                            <Link to="/sports" className="col d-flex flex-column position-relative mb-4 ms-auto">
                                <img src="/media/sports-banner.jpeg" style={{objectFit: "cover", width: "100%", height: "150px"}} alt="Sport" />
                                <h1 className="position-absolute top-50 start-50 translate-middle text-uppercase text-white">Sport</h1>
                            </Link>
                        </div>
                    </div>
                </section>
            </>
    } else if(error || error === undefined) {
        content = <Error status="500" />
    }

    return (
        <>
            <Adverts />
            {content}
        </>
    )
}

export default Home;