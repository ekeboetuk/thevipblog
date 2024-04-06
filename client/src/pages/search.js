import React from 'react'
import { useSearchParams } from 'react-router-dom'

import Skeleton from 'react-loading-skeleton'

import Adverts from '../components/adverts'
import { Postcard } from '../components/cards'
import { usePosts } from '../hooks/fetchers'

export default function Search({count}) {
    const [search] = useSearchParams()
    const {isLoading, error, posts} = usePosts(`/search?q=${search.get("q")}`)
    let content

   if(error) {
       content =
            <>
                <p className="text-danger">Error fetching posts</p>
            </>
   }
   if(isLoading) {
        content =
        <>
            <div className="d-flex flex-row pb-5">
                <Skeleton height="100px" width="160px" className="rounded-0" style={{lineHeight: 5}}/>
                <div className="w-100 p-3 rounded-0" style={{backgroundColor: "#FBFBFB"}}>
                    <Skeleton width="50%" height="20px" />
                    <div className="d-flex flex-row pt-2">
                        <Skeleton width="5px" height="40px" />
                        <div className="px-2 flex-fill">
                            <Skeleton width="100%" height="15px"/>
                            <Skeleton width="70%" height="15px"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row pb-5">
                <Skeleton height="100px" width="160px" className="rounded-0" style={{lineHeight: 5}}/>
                <div className="w-100 p-3 rounded-0" style={{backgroundColor: "#FBFBFB"}}>
                    <Skeleton width="50%" height="20px" />
                    <div className="d-flex flex-row pt-2">
                        <Skeleton width="5px" height="40px" />
                        <div className="px-2 flex-fill">
                            <Skeleton width="100%" height="15px"/>
                            <Skeleton width="70%" height="15px"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row pb-5">
                <Skeleton height="100px" width="160px" className="rounded-0" style={{lineHeight: 5}}/>
                <div className="w-100 p-3 rounded-0" style={{backgroundColor: "#FBFBFB"}}>
                    <Skeleton width="50%" height="20px" />
                    <div className="d-flex flex-row pt-2">
                        <Skeleton width="5px" height="40px" />
                        <div className="px-2 flex-fill">
                            <Skeleton width="100%" height="15px"/>
                            <Skeleton width="70%" height="15px"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row pb-5">
                <Skeleton height="100px" width="160px" className="rounded-0" style={{lineHeight: 5}}/>
                <div className="w-100 p-3 rounded-0" style={{backgroundColor: "#FBFBFB"}}>
                    <Skeleton width="50%" height="20px" />
                    <div className="d-flex flex-row pt-2">
                        <Skeleton width="5px" height="40px" />
                        <div className="px-2 flex-fill">
                            <Skeleton width="100%" height="15px"/>
                            <Skeleton width="70%" height="15px"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
   }
   if(posts) {
        content =
            <>
                {posts.slice(0,count).map((post) => (
                        <div key={post._id} className={`col d-flex flex-column flex-md-row pe-md-3 pb-5 align-self-stretch transition ${isLoading&&"opacity-50"}`}>
                            <Postcard
                                id={post._id}
                                slug={post.slug}
                                image={post.image}
                                imgWidth="200px"
                                height="100px"
                                title={post.title}
                                intro={post.intro.slice(0,200)}
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
            </>
   }

    return (
        <>
            <Adverts />
            <section className="container-fluid mx-auto">
                <div className="container-md d-flex flex-column">
                    <h4 className='border-left'>Search Results</h4>
                    {content}
                </div>
            </section>
        </>
    )
}
