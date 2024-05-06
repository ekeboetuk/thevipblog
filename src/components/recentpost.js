import { memo } from 'react';

import Skeleton from 'react-loading-skeleton';

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

function RecentPosts( {title, sort = '-_id', count, showMeta, showEngagement, query} ) {
    const {posts, loading} = usePosts(`?sort=${sort}`)

    if (loading) {
        return (
            <div className="d-flex flex-column">
                <Skeleton className="w-100" height="180px"/>
                <div className="p-3" style={{backgroundColor: "#FBFBFB"}}>
                    <Skeleton count={3} />
                </div>
            </div>
        )
    }else if(posts){
        let filter
        let approved = posts.filter((post) => post.isApproved)
        if (query) {
            filter = approved?.filter((post) => post.meta.author.id === query.slug)
        }else{
            filter = approved
        }
        if(filter === null) {
            return <Error status="204" document="recent post" />
        }else{
            return (
                <>
                    {title && <h4 className="text-uppercase mb-2">{title}</h4>}
                    <div className={`row row-cols-1 row-cols-md-${count}`}>
                        {filter.slice(0, count).map((post) => (
                            <div key={post._id} className={`notch-upward col g-4 gx-md-0 gy-md-0 d-flex flex-column`}>
                                <Postcard
                                    id={post._id}
                                    slug={post.slug}
                                    image={post.image}
                                    title={post.title}
                                    comments={post.comments}
                                    meta={post.meta}
                                    created={post.created}
                                    height="180px"
                                    showMeta={showMeta}
                                    showEngagement={showEngagement}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
    }else {
        return (
            <div className="text-center py-5">
                <h6 className="fst-italic text-danger fs-8">Error loading recent posts</h6>
            </div>
        )
    }
}

export default memo(RecentPosts)