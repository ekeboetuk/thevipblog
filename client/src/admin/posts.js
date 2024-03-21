import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { usePosts } from '../hooks/fetchers';
import { Error } from '../components/errors'
import axios from 'axios';

function Posts() {
    useEffect(()=>{
        document.title = "Afriscope Administrator - Manage Post"
    })

    const [query, setQuery] = useState({sort: "-_id", limit: 20});
    const {posts, error, isLoading, mutate} = usePosts(`s?sort=${query.sort}&limit=${query.limit}`)
    const [search, setSearch] = useState("");
    const [actionmenu, setActionmenu] = useState({})
    const [operation, setOperation] = useState();

    const spinnerbound = document.getElementById("contentarea")
    const navwidth = document.getElementById("adminnavigation")
    const alert = document.getElementById('alert')

    const handleSort = (e) => {
        setQuery({...query, sort: e.target.value})
        mutate(posts.sort((a, b)=>{
            return (a.meta.category).localeCompare((b.meta.category))
        }))
    }

    const handleLimit = (e) => {
        setQuery({...query, limit: e.target.value})
        mutate(posts.slice(e.target.value))
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
        const searchexp = new RegExp(`${search}`,'gi')
        mutate(posts.filter((post)=>{
            return searchexp.test(post.title)
        }))
    }

    const togglePublishPost = async (postId, status, index) => {
        setOperation(true)
        mutate(posts.map((post) => {
                if(post._id === postId) {
                    return {
                        ...post, isApproved: !status
                    }
                } else {
                    return post
                }
            }),
            await axios.patch(process.env.REACT_APP_SERVER_URL + `/post/togglestatus`,{
                id: postId,
                property: "isApproved",
                status: !status
            })
            .then(()=>{
                alert.classList.add('alert-success')
                alert.innerHTML = `<i class="fa-regular fa-circle-check pe-2"></i>Post ${status===true?'unplubished':'published'} successfully`
            })
        )
        setOperation(false)
        setActionmenu({})
        setTimeout(()=>{
            if(alert.classList.contains('alert-danger')){
                alert.classList.remove('alert-danger')
            }else{
                alert.classList.remove('alert-success')
            }
            alert.innerHTML = ''
        }, 8000)
    }

    const handleDeletePost = async (postId) => {
        setOperation(true)
        mutate(posts.filter((post)=>{
                return post._id !== postId
            }),
            await axios.delete(process.env.REACT_APP_SERVER_URL + `/post/${postId}`)
        )
        setOperation(false)
    }

    const togglePublishComment = async(postId, commentId, status)=>{
        setOperation(true)
        try{
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
                await axios.patch(process.env.REACT_APP_SERVER_URL + '/post/comment/togglestatus', {
                    postId: postId,
                    commentId: commentId,
                    status: !status
                },
                {
                    signal: AbortSignal.timeout(20000)
                })
                .then(()=>{
                    alert.classList.add('alert-success')
                    alert.innerHTML = `<i class="fa-regular fa-circle-check pe-2"></i>Comment successfully ${status?'unpublished':'published'}`
                })
            )
        } catch(err) {
            alert.classList.add('alert-danger')
            alert.innerHTML = `<i class="fa-solid fa-triangle-exclamation pe-2"></i>Error updating comment (${err.message})`
        }
        setOperation(false)
        setTimeout(()=>{
            if(alert.classList.contains('alert-danger')){
                alert.classList.remove('alert-danger')
            }else{
                alert.classList.remove('alert-success')
            }
            alert.innerHTML = ''
        }, 8000)
    }

    const handleDeleteComment = async (postId, postIndex, commentId) => {
        setOperation(true)
        await axios.delete(process.env.REACT_APP_SERVER_URL + `/post/${postId}/${commentId}`)
        mutate(posts.map((post)=>{
                return {
                    ...post, comments: post.comments.filter((comment) => comment._id !== commentId)
                }
            }))
        setOperation(false)
    }

    const toggleFeatured = async(index, postId, featured) => {
        mutate(await axios.patch(process.env.REACT_APP_SERVER_URL + `/post/togglestatus`,{
                id: postId,
                property: "meta.featured",
                status: !featured
            })
            .then((response)=>{
                alert.classList.add('alert-success')
                alert.innerHTML = `<i class='fa-regular fa-circle-check pe-2'></i>${response.data}`
            })
            .catch((err) => {
                alert.classList.add('alert-danger')
                alert.innerHTML = `<i class="fa-regular fa-circle-check pe-2"></i>Error updating post (${err.message})`
            })
        )
        setTimeout(()=>{
            if(alert.classList.contains('alert-danger')){
                alert.classList.remove('alert-danger')
            }else{
                alert.classList.remove('alert-success')
            }
            alert.innerHTML = ''
        }, 8000)
    }

    const toggleActionmenu = (e, index)=>{
        e.stopPropagation()
        setActionmenu({[index]:  !actionmenu[index]})
    }

    if(posts){
        if(posts.length === 0) {
            return (
               <Error status="204" document="Post" />
            )
        }else{
            return (
                <div>{isLoading && <div className="position-fixed translate-middle-x" style={{top: `50vh`, left: `calc(${navwidth?.clientWidth + spinnerbound?.clientWidth/2}px)`}}><i className="fa-solid fa-circle-notch fa-spin me-2"></i><i>Please Wait...</i></div>}
                    <div className={`${isLoading && "opacity-25"} mb-0 mb-md-5 pe-md-0`} onClick={()=>setActionmenu({})}>
                    <input type="text" id="search" className="w-100 bg-light mb-3 px-3 py-1" value={search} onChange={(e)=>handleSearch(e)} placeholder="Ajax Search" />
                    <div className="d-flex flex-column flex-sm-row justify-content-between mb-2">
                        <div className="d-flex flex-wrap align-items-center mb-2">
                            <small className="fw-bold pe-2">View As:</small>
                            <div className="bg-light p-2 rounded-pill px-4">
                                <label className="pe-3"><input type="radio" name="view" value="Table" /> Table</label>
                                <label className="pe-3"><input type="radio" name="view" value="List" defaultChecked={true}/> List</label>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap align-items-center mb-2">
                            <small className="fw-bold pe-2">Sort By:</small>
                            <div className="bg-light p-2 rounded-pill px-4">
                                <select id="sort" className="border-0 pt-0 pb-0" name="sort" value={query.sort} onChange={(e)=>handleSort(e)}>
                                    <option value="-_id">Created</option>
                                    <option value="updatedAt">Updated</option>
                                    <option value="-meta.category">Category</option>
                                    <option value="meta.author">Author</option>
                                    <option value="-isApproved">Status</option>
                                    <option value="-meta.featured">Featured</option>
                                    <option value="comments">Engagement</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap align-items-center mb-2">
                            <small className="fw-bold pe-2">Posts Per Page:</small>
                            <div className="bg-light p-2 rounded-pill px-4">
                                <select id="limit" className="border-0 pt-0 pb-0" name="limit" value={query.limit} onChange={(e) => handleLimit(e)}>
                                    <option value={2}>2</option>
                                    <option value={5}>5</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value={200}>200</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <table className={`table table-striped table-hover`}>
                        <tbody className="position-relative">
                            {posts?.map((post, index) => (
                                <tr key={index} className={`${!post.isApproved && "opacity-50"} post`}>
                                    <td className="border-0 p-3">
                                        <div className="post d-flex flex-column flex-md-row justify-content-between align-items-start position-relative">
                                            <div style={{
                                                    backgroundImage:`url(${post.image})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    height: "142px",
                                                    maxHeight: "142px"
                                                }}
                                                className="d-flex me-0 me-md-3 mb-3 mb-md-0 col-md-2 align-self-stretch rounded-6 border border-3 border-white">
                                                <div type="button" className="align-self-start" onClick={()=>toggleFeatured(index, post._id, post.meta.featured)}><i className={`${post.meta.featured?"fa-solid fa-star":"fa-regular fa-star"} p-2 text-warning`}></i></div>
                                            </div>
                                            <div className="d-flex flex-column flex-grow-1 me-md-3">
                                                <Link to={`/${post.meta.category}/${post.slug}`} target="_blank" className="d-flex align-items-center text-black"><h5 className="title fw-bold pe-1">{post.title.toUpperCase()}</h5><i className="blank fa-solid fa-arrow-up-right-from-square"></i></Link>
                                                <span className="mb-2 text-justify fs-5">{post.intro}</span>
                                                <span className="ps-1 fs-5"><i className="fas fa-bars-staggered pe-2"></i>{post.meta.category[0].toUpperCase()+post.meta.category.slice(1)}</span>
                                                <span className="ps-1 fs-5 fw-bold"><i className="fas fa-user-circle pe-2"></i>{post.meta.author.name} &ensp;<i className="fas fa-envelope pe-2"></i>{post.meta.author.email}</span>
                                                <details className="ps-1 fs-5">
                                                    <summary><small> Comments <span className="badge rounded-pill badge-dark">{post.comments.length}</span></small></summary>
                                                    {post.comments.map((comment, postIndex) => (
                                                        <div key={postIndex} className="listing d-flex py-1 justify-content-between">
                                                            <small className="ps-4 pe-2"><i className="fas fa-caret-right"></i></small>
                                                            <small className={`${comment.approved?"opacity-100":"opacity-25"} d-flex flex-column me-auto`}>
                                                                <span className="fw-bold order-1">{comment.content}</span>
                                                                <span className="order-0">{comment.user?.name||"Administrator"}</span>
                                                            </small>
                                                            <small className="d-flex no-wrap align-self-center">
                                                                <i type="button" className="fa-solid fa-trash pe-3" onClick={()=>handleDeleteComment(post._id, postIndex, comment._id)}></i>
                                                                <i type="button" className="fa-regular fa-pen-to-square pe-3"></i>
                                                                <i type="button" className={`fa-regular ${comment.approved?"fa-eye-slash":"fa-eye"}`} onClick={()=>togglePublishComment(post._id, comment._id, comment.approved)}></i>
                                                            </small>
                                                        </div>
                                                    ))}
                                                </details>
                                            </div>
                                            <div className="actionbutton">
                                                <span type="button" className="fa-solid fa-ellipsis-vertical bg-transparent border-0 position-absolute top-0 end-0" onClick={(e)=>toggleActionmenu(e, index)}></span>
                                                {actionmenu[index] &&
                                                <div className="d-flex flex-column position-absolute top-0 end-0 bg-tertiary actionmenu shadow-sm">
                                                    <button className="border-0 menuitem bg-tertiary"  onClick={()=>togglePublishPost(post._id, post.isApproved, index)}>{post.isApproved?'Unpublish':'Publish'}</button>
                                                    <button className="border-0 menuitem bg-tertiary">Edit Post</button>
                                                    <button className="border-0 menuitem bg-tertiary"  onClick={()=>handleDeletePost(post._id)}>Delete</button>
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {operation ? <tr><td className="position-absolute top-0 start-0 opacity-75 w-100 h-100 bg-white"><div className="position-absolute top-50 start-50 translate-middle-x fst-italic"><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait...</div></td></tr>:null}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
    } else if(isLoading) {
        return (
            <div className="position-absolute align-self-center fw-semibold" style={{top: `calc(${spinnerbound?.offsetHeight/2}px)`, right: `calc(${spinnerbound?.offsetWidth/2}px)`}}>
                <i className="fa-solid fa-circle-notch fa-spin me-2"></i><i>Please Wait! Loading...</i>
            </div>
        )
    }else if(error || error === undefined) {
        return <Error status="500" />
    }
}

export default Posts