import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom'

import Skeleton from 'react-loading-skeleton'

import Adverts from '../components/adverts'
import { Postcard } from '../components/cards'
import { usePosts } from '../hooks/fetchers'

export default function Search({count}) {
    const [search, setSearchParams] = useSearchParams()
    const [advanced, setAdvanced] = useState(false)
    const [state, setState] = useState({
                                        query: search.get('q')||'',
                                        author: search.get('author')||'',
                                        category: search.get('category')||'all'
                                    })
    const {isLoading, error, posts} = usePosts(`/search?q=${search.get("q")}`)
    let content

    useEffect(()=>{
        document.title = `Afriscope Blog Search - ${search.get('q')}`
        window.scrollTo({top:0,left:0,behavior:'smooth'})
    },[search])

    useEffect(()=>{
        advanced?setSearchParams(`q=${state.query}&author=${state.author}&category=${state.category}`):setSearchParams(`q=${state.query}`)
    },[setSearchParams, state, advanced])

    const serializeFormQuery = (e) => {
        const value = e.target.value;
            flushSync(()=>{
                setState({
                    ...state,
                    [e.target.name]: value
                })
            })
    }

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
        if(posts.length === 0) {
            content = <p className='fst-italic'>Nothing found under <strong>{search.get('q')||"null"}</strong>. Please revise the search term and try again.</p>
        }else{
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
   }

    return (
        <>
            <Adverts />
            <section className="container-fluid mx-auto">
                <div className="container-md d-flex flex-column">
                    {advanced &&
                    <>
                        <h4 className="text-brand text-uppercase">This is an ajax search</h4>
                        <em className="fs-6 mb-4">Put the search query inbetween quotation marks if you wish it to appear as-is</em>
                        <form id="search" className="mb-5 d-flex flex-column flex-md-row">
                            <label className="fst-italic fw-bolder d-flex align-items-end lh-1">Search Query: &nbsp; <input type="text" className="flex-fill" name="query" value={state.query} onChange={(e)=>serializeFormQuery(e)} /></label>
                            &emsp;  &emsp;
                            <label className="fst-italic fw-bolder d-flex align-items-end lh-1">Author: &nbsp; <input type="text" className="flex-fill" name="author" value={state.author} onChange={(e)=>serializeFormQuery(e)} /></label>
                            &emsp; &emsp;
                            <label className="fst-italic fw-bolder d-flex align-items-end lh-1">Category: &nbsp;
                                <select name="category" className="flex-fill" value={state.category} onChange={(e)=>serializeFormQuery(e)} >
                                    <option value="all">All</option>
                                    <option value="lifestyles">Lifestyles</option>
                                    <option value="sports">Sports</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="techonology">Technology</option>
                                </select>
                            </label>
                        </form>
                    </>}
                    <h4 className='border-left text-brand'>Search Results</h4>
                    {content}
                    <button className="btn btn-primary px-4 py-2 fw-bolder" onClick={()=>setAdvanced(!advanced)}>Advanced Search</button>
                </div>
            </section>
        </>
    )
}
