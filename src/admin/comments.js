import { useEffect, useState } from 'react';


import { usePosts } from '../hooks/fetchers';
import { Error } from '../components/errors'

function Comments() {
    useEffect(()=>{
        document.title = "Afriscope Administrator - Manage Comments"
    })

    const [sortby] = useState("_id");
    const {posts, error, loading, mutating} = usePosts(`?sort=${sortby}`)
    const [search, setSearch] = useState("");
    const [select, setSelect] = useState({})


    const handleSearch = (e) => {
        setSearch(e.target.value)
        const searchexp = new RegExp(`${search}`,'gi')
        mutating(posts.filter((post)=>{
            return searchexp.test(post.title)
        }))
    } 


    if(posts){
        if(posts.length === 0) {
            return <Error status="204" element="comment" />
        }else{
            return (
                <div className={`position-relative flex-fill`}>{loading && <i className="fa-solid fa-circle-notch fa-spin me-2 position-absolute" style={{left: "30vw", top: "40vh"}}></i>}
                    <div className={`${loading && "opacity-25"} mb-0 pe-md-0`} >
                    <input type="text" id="search" className="w-100 bg-light mb-3 px-3 py-1" value={search} onChange={(e)=>handleSearch(e)} placeholder="Ajax Search" />
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex bg-tertiary align-items-center border-bottom p-2 text-uppercase">
                            <input type="checkbox" id="checkall" className="me-2" name="checkall" value={select} onChange={()=>setSelect(!select)} />
                            <ul className="d-none d-md-flex flex-fill align-items-center row-cols-3 mb-0 list-unstyled fw-semibold">
                                <li className="col-12 col-md-4">Comment</li>
                                <li className="col-12 col-md-5">Post</li>
                                <li className="col-12 col-md-3">User</li>
                            </ul>
                            <div className="d-flex d-md-none col-12 fw-bold">Select All</div>
                        </div>
                        {posts?.map((post, postIndex) => (
                            post.comments.map((comment, commentIndex) => (
                                <div key={commentIndex} className="d-flex p-2" id="comments">
                                    <small><input type="checkbox" id={comment._id} className="me-2" name={comment._id} value={select[`${postIndex}${commentIndex}`]} onChange={()=>setSelect({...select, [`${postIndex}${commentIndex}`]: !select[`${postIndex}${commentIndex}`]})} /></small>
                                    <ul className={`d-flex flex-column flex-md-row flex-fill row-cols-3 mb-0 align-items-top list-unstyled ${!comment.approved && "opacity-50"}`}>
                                        <li className="col-12 col-md-4 pe-2 fw-normal"><label htmlFor={comment._id}>{comment.content}</label></li>
                                        <li className="col-12 col-md-5 pe-2">{post.title}</li>
                                        <li className="col-12 col-md-3">{comment.user?.name||"Administrator"}<br /><small className="fst-italic">{comment.user?.email||"admin@afriscope.ng"}</small></li>
                                    </ul>
                                </div>
                        ))))}
                    </div>
                </div>
            )}
    } else if(loading) {
        return (
            <div className="position-absolute align-self-center fw-semibold" style={{top: `calc(${window.innerHeight/3}px)`}}>
                <i className="fa-solid fa-circle-notch fa-spin me-2"></i><i>Please Wait! Loading...</i>
            </div>
        )
    }else if(error) {
        return (
            <div className="text-center align-self-center">
                <h6 className="fs-8">Error fetching comments. Please try again!</h6>
                <h6 className="text-danger fs-8 fst-italic">({error.code})</h6>
            </div>
        )
    }
}

export default Comments