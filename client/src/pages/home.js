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
    const {posts, error, isLoading} = usePosts(`/?sort=-_id`)
    const [quotes, setQuotes] = useState()
    const quote = useRef({quote: "Advertise you products here at an affordable rate", name: "Afriscope"})
    const qdcount = useRef(0)
    let content, approved, editorsPick//, featured

    useEffect(()=>{
        document.title = "Afriscope - Your Favourite Blog - Homepage"
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

    if(isLoading) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        content =
            <div className="container-md row mx-auto p-4 my-5">
                <div className="d-flex gap-2">
                    <Skeleton width="5px" height="30px" baseColor="#EBEBEB"/>
                    <Skeleton width="100px" height="25px" baseColor="#FAFAFA"/>
                </div>
                <div className="col-12 col-md-8 pe-md-5 align-self-start">
                    <SkeletonTheme baseColor="#FAFAFA">
                        <Skeleton width="100%" height="400px"/>
                        <div className="p-3 mb-5"style={{backgroundColor: "#ebebeb", lineHeight: "2.5rem"}}>
                            <Skeleton width="80%" height="20px" />
                            <Skeleton count={3.2} width="100%" height="20px"/>
                        </div>
                    </SkeletonTheme>
                </div>
                <div className="col-12 col-md-4">
                    <SkeletonTheme baseColor="#FAFAFA" containerClassName="mb-5">
                        <Skeleton width="100%" height="200px"/>
                        <div className="p-3 mb-3"style={{backgroundColor: "#ebebeb"}}>
                            <Skeleton count={2.7} width="100%" height="15px" />
                        </div>
                    </SkeletonTheme>
                    <div className="bg-tertiary p-3 mb-3">
                        <Skeleton  count ={2.7} width="100%" height="15px"/>
                        <Skeleton width="40%" height="15px" />
                    </div>
                    <div className="bg-tertiary p-3 mb-3 lh-2">
                        <Skeleton  count ={2.7} width="100%" height="15px"/>
                        <Skeleton width="40%" height="15px" />
                    </div>
                </div>
            </div>
    } else if(posts) {
        approved = posts.filter(post => post.isApproved)
        editorsPick = approved.filter(post => post.meta.editorsPick)
        //featured = approved.filter(post => post.meta.featured)
        approved.length === 0?
        content = <Error status="204" document="Post" />:
        content =
            <>
                <section>
                    {editorsPick.length !== 0?
                        <div className="container-md mx-auto row row-col-2">
                            <div className={`col col-12 col-md-${editorsPick.length>1?8:12} pe-md-4 mb-5 mb-md-0 align-self-stretch`}>
                                <PostcardTransparent
                                    id={editorsPick[0]._id}
                                    slug={editorsPick[0].slug}
                                    image={editorsPick[0].image}
                                    height="450px"
                                    title={editorsPick[0].title}
                                    intro={`${editorsPick[0].intro.slice(0, 500)}...`}
                                    comments={editorsPick[0].comments}
                                    meta={editorsPick[0].meta}
                                    created={editorsPick[0].created}
                                    showIntro={true}
                                    showMeta={true}
                                    showCategory={true}
                                    />
                            </div>
                                <div className="col col-12 col-md-4 ps-md-4">
                                    <div className="d-flex flex-column gap-4">
                                    {editorsPick.length > 1 &&
                                        <PostcardTransparent
                                            id={editorsPick[1]._id}
                                            slug={editorsPick[1].slug}
                                            image={editorsPick[1].image}
                                            height="250px"
                                            title={editorsPick[1].title}
                                            intro={`${editorsPick[1].intro.slice(0, 500)}...`}
                                            comments={editorsPick[1].comments}
                                            meta={editorsPick[1].meta}
                                            created={editorsPick[1].created}
                                            showCategory={true}
                                            showMeta={true}
                                        />
                                    }

                                    {editorsPick.length > 2 &&
                                        <Postcard
                                            id={editorsPick[2]._id}
                                            slug={editorsPick[2].slug}
                                            title={editorsPick[2].title}
                                            comments={editorsPick[2].comments}
                                            category={editorsPick[2].meta.category}
                                            meta={editorsPick[2].meta}
                                            created={editorsPick[2].created}
                                            height="100px"
                                            showCategory={true}
                                            showMeta={false}
                                            showReadmore={false}
                                            showEngagement={false}
                                            font="1.8rem"
                                        />
                                    }
                                    {editorsPick.length > 3 &&
                                        <Postcard
                                            id={editorsPick[3]._id}
                                            slug={editorsPick[3].slug}
                                            title={editorsPick[3].title}
                                            comments={editorsPick[3].comments}
                                            category={editorsPick[3].meta.category}
                                            meta={editorsPick[3].meta}
                                            created={editorsPick[3].created}
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
                <section className="container-fluid" style={{backgroundColor: 'rgba(88, 88, 88, 0.1)'}}>
                    <div className="container-md mx-auto row">
                        <div className="col-12 col-md-3 order-md-last">
                            <Advertise title="Look Here" content={quote.current} />
                            <div className="sticky-top mb-5" style={{top: "60px", zIndex: "-1"}}>
                                <Subscribe />
                            </div>
                        </div>
                        <h2 className="col-12 border-left">Just In</h2>
                        <div className="col-12 col-md-9 row row-cols-1 row-cols-md-3 pe-0 pe-md-4">
                            {approved.slice(0,6).map((post) => (
                                <div key={post._id} className="col pe-md-3
                                pb-5 align-self-start transition">
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
                    </div>
                </section>
                <section id="popular-categories" className="container-fluid mx-auto">
                    <h2 className="container-md border-left">Popular Categories</h2>
                    <div className="container-md d-flex flex-column flex-md-row">
                        <div className="row row-cols-1 row-cols-md-3">
                            <Link to="/technology" className="col d-flex flex-column position-relative mb-4 pe-md-4">
                                <img src="/media/technology.jpeg" style={{objectFit: "cover", width: "100%", height: "150px"}} alt="Technology" />
                                <h1 className="position-absolute top-50 start-50 translate-middle text-uppercase text-white">Technology</h1>
                            </Link>
                            <Link to="/fashion" className="col d-flex flex-column position-relative mb-4 pe-md-4">
                                <img src="/media/fashion-banner.jpeg" style={{objectFit: "cover", width: "100%", height: "150px"}} alt="Fashion" />
                                <h1 className="position-absolute top-50 start-50 translate-middle text-uppercase text-white">Fashion</h1>
                            </Link>
                            <Link to="/sports" className="col d-flex flex-column position-relative mb-4 pe-md-4">
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