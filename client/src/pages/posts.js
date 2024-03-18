import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { usePosts } from '../hooks/fetchers';

import { Postcard, PostcardTransparent } from '../components/cards';
import { Advertise, Subscribe } from '../components/widgets'
import { Error } from '../components/errors';

function Posts() {
    const path = useParams().path

    useEffect(()=> {
        document.title = `Afriscope Blog - ${path[0].toLocaleUpperCase()+path.slice(1)}`
    }, [path])

    const {posts, error, isLoading} = usePosts(`s?sort=-_id`)
    let content;
    let filter;

    if(isLoading) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        content =
            <section className="text-center mb-auto">
                <img src="/assets/spinner_block.gif" width="60px" alt="loading" />
            </section>
    } else if(posts) {
        filter = posts.filter((post) => post.meta.category === path && post.isApproved)
        filter.length === 0?
        content = <Error status="204" document={`Post Under ${path} Category`} />:
        content =
            <>
                <section>
                    <h2 className="container-md border-left">Editor's Pick</h2>
                    <div className="container-md mx-auto row row-col-2">
                        <div className="col col-12 col-md-8
                        pe-md-4 mb-5 mb-md-0 align-self-stretch">
                            <PostcardTransparent
                                id={posts[0]._id}
                                slug={posts[0].slug}
                                image={posts[0].image}
                                height="500px"
                                title={posts[0].title}
                                intro={`${posts[0].intro.slice(0, 300)}...`}
                                comments={posts[0].comments}
                                meta={posts[0].meta}
                                created={posts[0].created}
                                showIntro={true}
                                showMeta={true}
                                />
                        </div>
                        <div className="col col-12 col-md-4 ps-md-4">
                            <div className="d-flex flex-column gap-4">
                                <PostcardTransparent
                                    id={posts[1]._id}
                                    slug={posts[1].slug}
                                    image={posts[1].image}
                                    height="300px"
                                    title={posts[1].title}
                                    intro={`${posts[1].intro.slice(0, 300)}...`}
                                    comments={posts[1].comments}
                                    meta={posts[1].meta}
                                    created={posts[1].created}
                                />
                                <Postcard
                                    id={posts[2]._id}
                                    slug={posts[2].slug}
                                    title={posts[2].title}
                                    comments={posts[2].comments}
                                    category={posts[2].meta.category}
                                    meta={posts[2].meta}
                                    created={posts[2].created}
                                    height="100px"
                                    showCategory={true}
                                    showMeta={false}
                                    showReadmore={false}
                                    showEngagement={false}
                                />
                                <Postcard
                                    id={posts[0]._id}
                                    slug={posts[0].slug}
                                    title={posts[0].title}
                                    comments={posts[0].comments}
                                    category={posts[0].meta.category}
                                    meta={posts[0].meta}
                                    created={posts[0].created}
                                    height="100px"
                                    showCategory={true}
                                    showMeta={false}
                                    showReadmore={false}
                                    showEngagement={false}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="container-fluid mx-auto" style={{backgroundColor: 'rgba(88, 88, 88, 0.1)'}}>
                    <h2 className="container-md border-left">{`Featured In ${path}`}</h2>
                    <div className="container-md d-flex flex-column flex-md-row">
                        <div className="col-12 col-md-9 row row-cols-1 row-cols-md-3 pe-0 pe-md-4">
                            {filter.map((post) => (
                                <div key={post._id} className="col pe-md-3
                                pb-5 align-self-start transition">
                                    <PostcardTransparent
                                    id={post._id}
                                    slug={post.slug}
                                    image={post.image}
                                    height="300px"
                                    title={post.title}
                                    intro={`${post.intro.slice(0, 300)}...`}
                                    comments={post.comments}
                                    meta={post.meta}
                                    created={post.created}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="col-12 col-md-3">
                            <Advertise />
                            <Subscribe />
                        </div>
                    </div>
                </section>
            </>
    } else if(error || error === undefined) {
        content = <Error status="500" />
    }

    return (
        <>
                {content}
        </>
    )
}

export default Posts;