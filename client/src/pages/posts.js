import { useParams } from 'react-router-dom';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

import { usePosts } from '../hooks/fetchers';

import { Postcard, PostcardTransparent } from '../components/cards';
import { Advertise, Subscribe } from '../components/widgets'
import { Error } from '../components/errors';
import { PostsCarousel, CarouselWrapper } from '../components/carousels';

function Posts() {
    const category = useParams().category
    const {posts, error, loading} = usePosts(`/${category}?sort=-_id`)
    let content, filtered, editorsPick, featuredIn

    if(!["lifestyles","sports","fashion","technology","education","general"].includes(category)){
        document.title = `Afriscope Blog - Not Found`;
        return(
            <section className="container-md mx-auto">
                <Error status="404" element="Page" />
                <h3 className="border-left">You Might Be Interested In</h3>
                <PostsCarousel count={4}/>
            </section>
        )
    }

    if(loading) {
        window.scrollTo({top:0,left:0,behavior:'smooth'})
        content =
            <section>
                <div className="container-md row mx-auto">
                    <div className="d-flex gap-2">
                        <Skeleton width="5px" height="30px" baseColor="#EBEBEB"/>
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
            </section>
    } else if(posts) {
        document.title = `Afriscope Blog - ${category[0].toLocaleUpperCase()+category.slice(1)}`
        filtered = posts.filter(post => post.meta.category === category && post.isApproved)
        editorsPick = filtered.filter(post => post.meta.editorsPick)
        featuredIn = filtered.filter(post => post.meta.featured)
        filtered.length === 0?
        content = <Error status="204" element={`No Post Under ${category} Category`} />:
        content =
            <>
                <section>
                    <h3 className="container-md border-left">Editor's Pick</h3>
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
                            <Advertise title="Advertise Here" content={{quote: "Advertise you products here at an affordable rate", name: "Afriscope"}}/>
                            <div className="sticky-top pb-2" style={{top: "65px", zIndex: "-1"}}>
                                <Subscribe />
                            </div>
                        </div>
                        <h3 className="col-12 border-left">{`Latest`}</h3>
                        <div className="col-12 col-md-9 row row-cols-1 row-cols-md-3 pe-0 pe-md-4">
                            {filtered.slice(0,6).map((post) => (
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
                                    showMeta={true}
                                    created={post.created}
                                    showFeatured={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="container-fluid mx-auto">
                    <h3 className="container-md border-left">{`Featured In ${category}`}</h3>
                    {featuredIn.length > 0?
                        <CarouselWrapper limit={Math.min(featuredIn.length, 6)}>
                            <div id="featured" className="col-12 row row-cols-1 row-cols-md-3 flex-nowrap">
                                {featuredIn.slice(0,6).map((post) => (
                                    <div key={post._id} className="notch-upward col d-flex flex-row align-self-start transition">
                                        <Postcard
                                            id={post._id}
                                            slug={post.slug}
                                            image={post.image}
                                            height="125px"
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
                                            font="1.4rem"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CarouselWrapper>:
                        <p className="container-md">Nothing To See Here Today!</p>
                    }
                </section>
            </>
    } else if(error || error === undefined) {
        document.title = `Afriscope Blog - ${category[0].toLocaleUpperCase()+category.slice(1)}`
        content = <Error status="500" />
    }

    return (
        <>
            {content}
        </>
    )
}

export default Posts;