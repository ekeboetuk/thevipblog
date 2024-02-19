import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PostcardTransparent } from '../components/cards';
import { usePosts } from '../hooks/fetchers';

import { Error } from '../components/errors';

function Posts() {
    const params = useParams()
    useEffect(()=> {
        document.title = `Afriscope Blog - ${params.slug.charAt(0).toUpperCase()+params.slug.slice(1)} Category`
    }, [params.slug])

    const {posts, error, isLoading} = usePosts('s?sort=-_id')
    let content;
    let filter;

    if(isLoading) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        content =
            <div className="text-center">
                <img src="/assets/spinner_block.gif" className="my-5 py-5" width="60px" alt="loading" />
            </div>
    } else if(posts) {
        if(params.path) {
            filter = posts.filter((post) => post.meta.author.name.split(' ').join('.') === params.slug && post.isApproved)
        }else{
            filter = posts.filter((post) => post.meta.category === params.slug && post.isApproved)
        }
        filter.length === 0?
        content = <Error status="204" document={`post under ${params.path?params.slug.split('.').join(' '):params.slug} ${params.path?'':'category'}`} />:
        content =
        <div className="container-md d-grid py-5">
            <div className="d-flex flex-row fw-semibold fs-4 px-2 align-items-end">
                <img src="/assets/icon.png" alt="afriscope icon" width={40} height={40} className="bg-tertiary rounded-circle p-1 me-2 " />
                {params.path?params.slug.split('.').join(' '):params.slug.charAt(0).toUpperCase()+params.slug.slice(1)}
            </div>
            <div className="row row-cols-1 row-cols-md-2">
                {filter.map((post) => (
                    <div key={post._id} className="col g-4">
                        <PostcardTransparent
                        id={post._id}
                        slug={post.slug}
                        image={post.image}
                        height="400px"
                        title={post.title}
                        intro={`${post.intro.slice(0, 200)}...`}
                        comments={post.comments}
                        meta={post.meta}
                        created={post.created}
                        />
                    </div>
                ))}
            </div>
        </div>
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