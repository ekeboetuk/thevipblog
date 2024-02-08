import { usePosts } from '../hooks/fetchers';
import { Postcard } from './cards';
import { Error } from './errors'

export function Tags() {
    const {posts} = usePosts('s')
    const tags = new Set()
    if(posts) {
        for (var i=0; i<posts.length; i++) {
            posts[i].meta.tags.split(", ").forEach(tag =>  tags.add(tag))
        }
    }
    return [...tags]
}

export default function RecentPosts( {number} ) {
    const {posts, isLoading} = usePosts('s?sort=-_id')

    if (isLoading) {
        return (
            <p className="py-3 fs-italic fw-bold text-white text-center"><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Loading Recent</p>
        )
    }else if(posts){
        const approved = posts.filter((post) => post.isApproved)
        if(approved.length === 0) {
            return <Error status="204" document="recent post" />
        }else{
            return (
                <div className={`row row-cols-1 row-cols-md-${number} p-0 py-md-${number}`}>
                    {approved.slice(0, number).map((post) => (
                        <div key={post._id} className={`col g-4 gx-md-${number} gy-md-0`}>
                            <Postcard
                                id={post._id}
                                slug={post.slug}
                                image={post.image}
                                title={post.title}
                                comments={post.comments}
                                meta={post.meta}
                                created={post.created}
                                height="180px"
                            />
                        </div>
                    ))}
                </div>
            )}
    }else {
        return (
            <div className="text-center py-4">
                <h6 className="fst-italic text-danger fs-8">Error loading recent posts</h6>
            </div>
        )
    }
}