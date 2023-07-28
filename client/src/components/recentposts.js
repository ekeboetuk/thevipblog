import { memo } from 'react';

import { usePosts } from '../hooks/fetchers';
import { Postcard } from './cards';

function RecentPosts( {number} ) {
    const [posts, isError, isLoading] = usePosts('s/')

    if (isLoading) {
        return (
            <p className="py-3 fs-italic fw-bold text-center"><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Loading Recent...</p>
        )
    }else if(isError) {
        return (
            <div className="text-center">
                <img src="/media/no_post.png" width="50px" className="py-3" alt="nopost" />
                <h6 className="fw-bold">Error loading recent posts</h6>
            </div>
        )
    }

    const published = posts.filter((post) => post.isApproved)
    return (
        <div className={`row row-cols-1 row-cols-md-${number} p-0 py-md-${number}`}>
            {published.slice(0, number).map((post) => (
                <div key={post._id} className={`col g-2 gx-md-${number} gy-md-0`}>
                    <Postcard
                        id={post._id}
                        slug={post.slug}
                        image={post.image}
                        title={`${post.title.split(" ").splice(0, 6).join(" ")}...`}
                        comments={post.comments}
                        meta={post.meta}
                        created={post.created}
                        height="180px"
                    />
                </div>
            ))}
        </div>
    )
}

export default memo(RecentPosts)