import { useParams } from 'react-router-dom';

import { Postcard } from '../components/cards';
import { usePosts } from '../hooks/fetchers';

import { Error } from '../components/errors';

function Posts() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    const {posts, error, isLoading} = usePosts('s?sort=-_id')
    const params = useParams()
    let content;

    if(isLoading) {
        content =
            <div className="text-center">
                <img src="/assets/spinner_block.gif" className="my-5 py-5" width="60px" alt="loading" />
            </div>
    } else if(posts) {
        const category = posts.filter((post) => post.meta.category === params.slug && post.isApproved)
        category.length === 0?
        content = <Error status="204" document={`post under ${params.slug} category`} />:
        content =
        <div className="container-md d-grid gap-4 py-5">
            <div className="row row-cols-md-3">
                {category.map((post) => (
                    <div key={post._id} className="col g-4">
                        <Postcard
                        id={post._id}
                        slug={post.slug}
                        image={post.image}
                        height="200px"
                        title={`${post.title.slice(0,38)}...`}
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
            <div className="container-fluid mx-auto text-center fw-bold fs-4 py-5 bg-tertiary">
                <img src="/assets/icon.png" alt="afriscope icon" className="py-2" />
                {params.slug.toUpperCase()}
            </div>
            {content}
        </>
    )
}

export default Posts;