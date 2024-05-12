import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

import { usePosts } from '../hooks/fetchers';
import axios from 'axios';

import Adverts from '../components/adverts';
import { Postcard, PostcardTransparent } from '../components/cards';
import { CarouselWrapper } from '../components/carousels';
import { Advertise, Subscribe } from '../components/widgets'
import { Error } from '../components/errors';
import { Title } from '../components/header';

function Home() {
    const {posts, error, loading} = usePosts(`/?sort=-_id`)
    const [catposts, setCatposts] = useState({})
    const [quotes, setQuotes] = useState()
    const [count, setCount] = useState(4)
    const quote = useRef({quote: "Advertise you products here at an affordable rate", name: "Afriscope"})
    const qdcount = useRef(0)
    let content, approved, featured

    useEffect(()=>{
        document.title = "Afriscope - Your Contentful Blog - Homepage";
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

    useEffect(()=>{
        axios.get(process.env.REACT_APP_SERVER_URL+'/posts/categories')
            .then(res => res.data.map(async el => await axios.get(process.env.REACT_APP_SERVER_URL+`/posts/${el}?sort=-meta.views&limit=4`)
                .then(res => setCatposts(catposts => ({...catposts, [el]:res.data})))
            ))
    },[])

    if(loading) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        content =
            <div className="container-md row mx-auto">
                <div className="d-flex gap-2 align-items-center">
                    <Skeleton width="30px" height="30px" baseColor="#EBEBEB" className="rounded-circle"/>
                    <Skeleton width="150px" height="20px" baseColor="#FAFAFA"/>
                </div>
                <div className="col-12 col-md-8 pe-md-4 align-self-start">
                    <SkeletonTheme baseColor="#FAFAFA">
                        <Skeleton width="100%" height="300px"/>
                        <div className="p-4 mb-5"style={{backgroundColor: "#ebebeb", lineHeight: "1.8rem"}}>
                            <Skeleton width="80%" height="20px" className="mb-2"/>
                            <Skeleton count={5.2} width="100%" height="10px" className="mb-2" />
                        </div>
                    </SkeletonTheme>
                </div>
                <div className="col-12 col-md-4 ps-md-4">
                    <SkeletonTheme baseColor="#FAFAFA" containerClassName="mb-5">
                        <Skeleton width="100%" height="165px"/>
                        <div className="p-4 mb-3"style={{backgroundColor: "#ebebeb"}}>
                            <Skeleton count={2.7} width="100%" height="16px" className="mb-1" />
                        </div>
                    </SkeletonTheme>
                    <div className="bg-tertiary p-4 mb-3" style={{backgroundColor: "#ebebeb", lineHeight: "1.8rem"}}>
                        <Skeleton  count ={1.8} width="100%" height="16px" className="mb-2" />
                        <Skeleton width="40%" height="15px" />
                    </div>
                    <div className="bg-tertiary p-4 mb-3 lh-2" style={{backgroundColor: "#ebebeb", lineHeight: "1.8rem"}}>
                        <Skeleton  count ={1.8} width="100%" height="16px" className="mb-1" />
                        <Skeleton width="40%" height="15px" />
                    </div>
                </div>
            </div>
    } else if(posts) {
        approved = posts?.filter(post => post.isApproved)
        featured = approved?.filter(post => post.meta.featured)
        approved.length === 0?
        content = <Error status="204" element="Just in time for the party. Subscribe to be the first to know ->" />:
        content =
            <>
                <section id="featured">
                    {featured.length !== 0?
                        <div className="container-md mx-auto row row-col-2">
                            <Title title="Featured Posts" />
                            <div className={`col col-12 col-md-${featured.length>1?8:12} pe-md-4 mb-5 mb-md-0 align-self-stretch`}>
                                <PostcardTransparent
                                    id={featured[0]._id}
                                    slug={featured[0].slug}
                                    image={featured[0].image}
                                    height="100%"
                                    title={featured[0].title}
                                    intro={`${featured[0].intro.slice(0, 500)}...`}
                                    comments={featured[0].comments}
                                    meta={featured[0].meta}
                                    showMeta={true}
                                    created={featured[0].created}
                                    showIntro={true}
                                    showEngagement={true}
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
                                            showEngagement={true}
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
                                            font="1.8rem"
                                        />
                                    }
                                </div>
                            </div>
                        </div>:
                        <p className='container-md'>You are all caught up here. Enjoy other selections.</p>
                    }
                </section>
                <section id="latest" className="container-fluid" style={{backgroundColor: 'rgba(88, 88, 88, 0.1)'}}>
                    <div className="container-md mx-auto row justify-content-center">
                        <div className="col-12 col-md-4 order-md-2 ps-md-4">
                            <Advertise title="Watch Here" content={quote.current} />
                            <div className="sticky-top mb-5 mb-md-4" style={{top: "60px", zIndex: "0"}}>
                                <Subscribe />
                            </div>
                        </div>
                        <div className="col-12">
                            <Title title="Recently Added" />
                        </div>
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
                                    showCategory={true}
                                    showEngagement={true}
                                    />
                                </div>
                            ))}
                        </div>
                        {approved.length > count && <button className="col-12 btn btn-primary fw-medium order-md-last" onClick={(e)=>{e.target.parentElement.classList.add('smooth'); setCount(count+2)}}>Load More</button>}
                    </div>
                </section>
                <section id="popular-categories" className="container-fluid mx-auto">
                    <div className="container-md d-flex flex-column">
                        <Title title="Popular Categories" />
                        <div className="d-flex row row-cols-1 row-cols-md-3">
                            <Link to="/technology" className="col d-flex flex-column position-relative mb-4 mb-md-0 pe-md-4">
                                <img src="/media/technology-banner.jpeg" style={{objectFit: "cover", width: "100%", height: "150px"}} alt="Technology" />
                                <h1 className="position-absolute top-50 start-50 translate-middle text-uppercase text-white">Technology</h1>
                            </Link>
                            <Link to="/fashion" className="col d-flex flex-column position-relative mb-4 mb-md-0 pe-md-4">
                                <img src="/media/fashion-banner.jpeg" style={{objectFit: "cover", width: "100%", height: "150px"}} alt="Fashion" />
                                <h1 className="position-absolute top-50 start-50 translate-middle text-uppercase text-white">Fashion</h1>
                            </Link>
                            <Link to="/sports" className="col d-flex flex-column position-relative mb-4 mb-md-0 ms-auto">
                                <img src="/media/sports-banner.jpeg" style={{objectFit: "cover", width: "100%", height: "150px"}} alt="Sport" />
                                <h1 className="position-absolute top-50 start-50 translate-middle text-uppercase text-white">Sport</h1>
                            </Link>
                        </div>
                    </div>
                </section>
                {approved.length > 0 &&
                    <section id="viewed" className="container-fluid mx-auto">
                        <div className="container-md">
                            <Title title={`Your Views`} />
                            <CarouselWrapper limit={Math.min(approved.length, 6)} autoplay={true} continous={true} scrollCount={1}>
                                <div id="carousel" className={`featured col-12 row row-cols-1 row-cols-md-${window.innerWidth<840?'2':'3'} flex-nowrap`}>
                                    {approved.slice(0,6).map((post) => (
                                        <div key={post._id} className="notch-upward col d-flex flex-row align-self-start transition">
                                            <Postcard
                                                id={post._id}
                                                slug={post.slug}
                                                image={post.image}
                                                imgWidth='70%'
                                                height="120px"
                                                title={post.title}
                                                comments={post.comments}
                                                meta={post.meta}
                                                category={post.meta.category}
                                                created={post.created}
                                                showCategory={false}
                                                showMeta={false}
                                                showFeatured={false}
                                                showReadmore={false}
                                                showEngagement={false}
                                                font="1.6rem"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CarouselWrapper>
                        </div>
                    </section>
                }
                {Object.keys(catposts).map((cat, index) => (
                    catposts[cat].length>0 &&
                        <section key={cat} id={cat} className={`container-fluid mx-auto categories ${index%2===0&&"bg-tertiary"}`}>
                            <div className="container-md">
                                <Link preventScrollReset={true} to={`/${cat}`}><Title title={cat.charAt(0).toUpperCase()+cat.slice(1)} /></Link>
                                <div className={`row row-cols-1 row-cols-md-${catposts[cat].length<3?'2':'3'} row-cols-xl-${catposts[cat].length<4?`${Math.max(catposts[cat].length, 2)}`:4} pe-0`}>
                                    {catposts[cat].slice(0,window.innerWidth<1200?3:4).map((post) => (
                                        <div key={post._id} className="col pb-4 align-self-start transition">
                                            <PostcardTransparent
                                                id={post._id}
                                                slug={post.slug}
                                                image={post.image}
                                                height={catposts[cat].length <3?"400px":"250px"}
                                                title={post.title}
                                                titlebg="light"
                                                intro={`${post.intro.slice(0, 220)}...`}
                                                showIntro={catposts[cat].length <3}
                                                comments={post.comments}
                                                meta={post.meta}
                                                showMeta={catposts[cat].length <3}
                                                created={post.created}
                                                showFeatured={true}
                                                showEngagement={true}
                                                font="1.5rem"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                ))}
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