import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom'

import Skeleton from 'react-loading-skeleton'

import Adverts from '../components/adverts'
import { Postcard } from '../components/cards'
import { usePosts } from '../hooks/fetchers'

export default function Search({limit = 20}) {
    const [max, setmax] = useState(limit)
    const [search, setSearch] = useSearchParams()
    const [advanced, setAdvanced] = useState(false)
    const [state, setState] = useState({
                                        query: search.get('q')||'',
                                        author: '',
                                        category: ''
                                    })
    const {posts, error, loading} = usePosts(`/search?${advanced?`q=${state.query}&author=${state.author}&category=${state.category}`:`q=${search.get('q')}`}`)
    let content, count, pagination

    useEffect(()=>{
        document.title = `Afriscope Blog Search - ${state.query}`
        window.scrollTo({top:0,left:0,behavior:'smooth'})
        window.history.replaceState({},`Afriscope Blog Search - ${state.query}`,`?q=${state.query}${state.category===''?'':`&category=${state.category}`}${state.author == ''?'':`&author=${state.author}`}`)
    },[search, state])

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
        console.log(error)
       content =
            <>
                <p className="text-danger">Error fetching posts</p>
            </>
   }
   if(loading) {
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
            content = <p className='fst-italic'>Nothing found under <strong>{state.query||"null"}</strong>. Please revise the search term and try again.</p>
        }else{
            count = posts.length
            pagination = Array.from({length:Math.ceil(count/limit)},(page, i)=><Link key={i} className="me-2 text-white bg-brand text-center" style={{width: '25px', height: '25px'}} onClick={()=>{setmax((i+1)*limit)}}>{i+1}</Link>)
            content =
                <>
                    {posts.slice(max-limit, max).map((post) => (
                            <div key={post._id} className={`col d-flex flex-column flex-md-row pe-md-3 pb-5 align-self-stretch transition ${loading&&"opacity-50"}`}>
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
                                    <option value="">All</option>
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
                    {limit < count && <div className="d-flex flex-row align-self-center">{pagination}</div>}
                    <button className="btn btn-primary px-4 py-2 fw-bolder" onClick={(e)=>{setAdvanced(!advanced); !advanced && serializeFormQuery(e); advanced && setSearch(`q=${state.query}`)}}>Advanced Search</button>
                </div>
            </section>
        </>
    )
}
