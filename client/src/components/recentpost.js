import { usePosts } from '../hooks/fetchers';
import { Postcard } from './cards';
import { Empty } from './errors'

function RecentPosts( {number} ) {
    const {posts, isLoading} = usePosts('s?sortby=_id')

    if (isLoading) {
        return (
            <p className="py-3 fs-italic fw-bold text-center"><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Loading Recent</p>
        )
    }else if(posts){
        const approved = posts.filter((post) => post.isApproved)
        if(approved.length === 0) {
            return (
               <Empty text="No Recent Post" />
            )
        }else{
            return (
                <div className={`row row-cols-1 row-cols-md-${number} p-0 py-md-${number}`}>
                    {approved.slice(0, number).map((post) => (
                        <div key={post._id} className={`col g-2 gx-md-${number} gy-md-0`}>
                            <Postcard
                                id={post._id}
                                slug={post.slug}
                                image={post.image}
                                title={`${post.title.split(" ").slice(0, 6).join(" ")}...`}
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
            <div className="text-center py-5">
                <img src="/media/no_post.png" width="50px" className="pb-2" alt="nopost" />
                <h6 className="fw-bold">Error loading recent posts</h6>
            </div>
        )
    }
}

export default RecentPosts