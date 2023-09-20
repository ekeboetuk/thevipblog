import { useState } from 'react';


import { usePosts } from '../hooks/fetchers';
import { Error } from '../components/errors'
import axios from 'axios';

function Comments() {
    const [sortby, setSortby] = useState("_id");
    const {posts, error, isLoading, mutate} = usePosts(`s?sortby=${sortby}`)
    const [search, setSearch] = useState("");
    const [actionmenu, setActionmenu] = useState({})
    const [operation, setOperation] = useState();
    const [select, setSelect] = useState({})

    const spinnerbound = document.getElementById('contentarea')

    const handleCommentsort = (e) => {
        setSortby(e.target.value)
        mutate(posts.sort((a, b)=>{
            return (a.meta.category).localeCompare((b.meta.category))
        }))
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
        const searchexp = new RegExp(`${search}`,'gi')
        mutate(posts.filter((post)=>{
            return searchexp.test(post.title)
        }))
    }


    const togglePublishComment = async(postId, commentId, status)=>{
        setOperation(true)
        mutate(posts.map((post)=>{
            return {
                ...post, comments: post.comments.map((comment) => {
                    if(comment._id === commentId) {
                        return {
                            ...comment, approved: !status}
                    }else{
                        return comment
                    }
                })
            }}),
            await axios.patch('http://localhost:3001/post/comment/togglestatus', {
                postId: postId,
                commentId: commentId,
                status: !status
            }))
        setOperation(false)
    }

    const handleDeleteComment = async (postId, postIndex, commentId) => {
        setOperation(true)
        mutate(
            [...posts, {...posts[postIndex], comments: posts[postIndex].comments.filter(comment => !comment.commentId)
            }],
            await axios.delete(process.env.REACT_APP_SERVER_URL + `/post/${postId}/${commentId}`)
        )
        setOperation(false)
    }

    const toggleActionmenu = (e, index)=>{
        e.stopPropagation()
        setActionmenu({[index]:  !actionmenu[index]})
    }

    if(posts){
        if(posts.length === 0) {
            return <Error status="204" document="comment" />
        }else{
            return (
                <div className={`position-relative flex-fill`}>{isLoading && <i className="fa-solid fa-circle-notch fa-spin me-2 position-absolute" style={{left: "30vw", top: "40vh"}}></i>}
                    <div className={`${isLoading && "opacity-25"} mb-0 pe-md-0`} onClick={()=>setActionmenu({})}>
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
    } else if(isLoading) {
        return (
            <div className="position-absolute align-self-center fw-semibold" style={{top: `calc(${spinnerbound?.offsetHeight/2}px)`, right: `calc(${spinnerbound?.offsetWidth/2}px)`}}>
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