import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PostcardTransparent } from '../components/cards';
import { usePosts } from '../hooks/fetchers';

import { Error } from '../components/errors';

function Posts() {
    const [search] = useSearchParams();
    const path = document.location.search.split('=')[0].replace('?','')
    const searchparam = search.get(path)
    const searchparams = searchparam.split('.')
    const title = (searchparams[0].charAt(0).toUpperCase()+searchparams[0].slice(1)) + " " + (searchparams[1]?(searchparams[1]?.charAt(0).toUpperCase()+searchparams[1]?.slice(1)):"")

    useEffect(()=> {
        document.title = `Afriscope Blog - ${title}`
    }, [title])

    const {posts, error, isLoading} = usePosts('s?sort=-_id')
    let content;
    let filter;

    if(isLoading) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        content =
            <div className="text-center">
                <img src="/assets/spinner_block.gif" width="60px" alt="loading" />
            </div>
    } else if(posts) {
        if(path === "category"){
            filter = posts.filter((post) => post.meta.category === searchparam && post.isApproved)
        }else if(path === "user"){
            filter = posts.filter((post) => post.meta.author.name.split(' ').join('.').toLowerCase() === searchparam && post.isApproved)
        }
        filter.length === 0?
        content = <Error status="204" document={`Post Under ${title} Category`} />:
        content =
            <div className="row row-cols-1 row-cols-md-2">
                {filter.map((post) => (
                    <div key={post._id} className="col gx-2
                    gy-5">
                        <PostcardTransparent
                        id={post._id}
                        slug={post.slug}
                        image={post.image}
                        height="400px"
                        title={post.title}
                        intro={`${post.intro.slice(0, 300)}...`}
                        comments={post.comments}
                        meta={post.meta}
                        created={post.created}
                        />
                    </div>
                ))}
            </div>
    } else if(error || error === undefined) {
        content = <Error status="500" />
    }

    return (
        <>
            <section className="container-md mx-auto">
                {content}
            </section>
        </>
    )
}

export default Posts;