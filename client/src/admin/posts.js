import { useState } from 'react';

import { Link } from 'react-router-dom';

import { usePosts } from '../hooks/fetchers';
import { Empty } from '../components/errors'
import axios from 'axios';

function Posts() {
    const [sortby, setSortby] = useState("_id");
    const {posts, error, isLoading, mutate} = usePosts(`s?sortby=${sortby}`)
    const [search, setSearch] = useState("");
    const [actionmenu, setActionmenu] = useState({})
    const [operation, setOperation] = useState();

    const spinnerbound = document.getElementById("contentarea")


    const handlePostsort = (e) => {
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
            await axios.patch(`http://localhost:3001/post/togglestatus`,{
                id: postId,
                property: "isApproved",
                status: !status
            })
        )
        setOperation(false)
        setActionmenu({})
    }

    const handleDeletePost = async (postId) => {
        setOperation(true)
        mutate(posts.filter((post)=>{
                return post._id !== postId
            }),
            await axios.delete(`http://localhost:3001/post/${postId}`)
        )
        setOperation(false)
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

    const toggleFeatured = async(postIndex, postId, featured) => {
        await axios.patch(process.env.REACT_APP_SERVER_URL + `/post/togglestatus`,{
            id: postId,
            property: "meta.featured",
            status: !featured
        })
        .then((response)=>{
            mutate()
            document.getElementById('alert').classList.toggle('alert-success')
            document.getElementById('alert').innerHTML = `<i class='fa-regular fa-circle-check pe-2'></i>${response.data}`
            setTimeout(()=>{
                document.getElementById('alert').classList.toggle('alert-success')
                document.getElementById('alert').innerHTML = ""
            }, 5000)
        })
    }

    const toggleActionmenu = (e, index)=>{
        e.stopPropagation()
        setActionmenu({[index]:  !actionmenu[index]})
    }

    if(posts){
        if(posts.length === 0) {
            return (
               <Empty text="No Post Found" />
            )
        }else{
            return (
                <div>{isLoading && <i className="fa-solid fa-circle-notch fa-spin me-2 position-absolute" style={{top: `40vh`, right: `calc(${spinnerbound.offsetWidth/2}px)`}}></i>}
                    <div className={`${isLoading && "opacity-25"} mb-0 mb-md-5 pe-md-0`} onClick={()=>setActionmenu({})}>
                    <input type="text" id="search" className="w-100 bg-light mb-3 px-3 py-1" value={search} onChange={(e)=>handleSearch(e)} placeholder="Ajax Search" />
                    <div className="d-flex flex-column flex-md-row justify-content-between mb-2">
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
                                <select id="postssort" className="border-0" name="postssort" value={sortby} onChange={(e)=>handlePostsort(e)}>
                                    <option value="_id">Created</option>
                                    <option value="updatedAt">Updated</option>
                                    <option value="meta.category">Category</option>
                                    <option value="meta.author">Author</option>
                                    <option value="isApproved">Status</option>
                                    <option value="meta.featured">Featured</option>
                                    <option value="comments">Engagement</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap align-items-center mb-2">
                            <small className="fw-bold pe-2">Posts Per Page:</small>
                            <div className="bg-light p-2 rounded-pill px-4">
                                <select id="postsquantity" className="border-0" name="postsquantity" defaultValue={20}>
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
                                                    backgroundImage: `url(data:image/jpeg;base64,${btoa(new Uint8Array(post.image.data.data).reduce(function (data, byte) {return data + String.fromCharCode(byte);}, ''))})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    height: "142px",
                                                    maxHeight: "142px"
                                                }}
                                                className="me-0 me-md-3 mb-3 mb-md-0 col-md-2 align-self-stretch rounded-6 border border-3 border-white">
                                            <div type="button" onClick={()=>toggleFeatured(index, post._id, post.meta.featured)}><i className={`${post.meta.featured?"fa-solid fa-star":"fa-regular fa-star"} p-2 text-warning fs-6`}></i></div>
                                            </div>
                                            <div className="d-flex flex-column flex-grow-1 me-md-3">
                                                <Link to={`/post/${post.title}`} target="_blank" className="d-flex align-items-center text-black"><h6 className="title fw-bold pe-1">{post.title}</h6><i className="blank fa-solid fa-arrow-up-right-from-square fs-8"></i></Link>
                                                <small className="mb-2 text-justify">{post.intro}</small>
                                                <small className="fw-bold"><i className="fas fa-user-circle pe-2"></i>{post.meta.author.name}</small>
                                                <small className=""><i className="fas fa-envelope pe-2"></i>{post.meta.author.email}</small>
                                                <details>
                                                    <summary><small>Comments({post.comments.length})</small></summary>
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
                                            <div className="actionmenu">
                                                <span type="button" className="fa-solid fa-ellipsis-vertical fs-5 bg-transparent border-0 position-absolute top-0 end-0" onClick={(e)=>toggleActionmenu(e, index)}></span>
                                                {actionmenu[index] &&
                                                <div className="d-flex flex-column position-absolute top-0 end-0 mt-4 bg-tertiary p-1 actionmenu rounded-5 shadow-sm">
                                                    <button className="border-0 menuitem"  onClick={()=>togglePublishPost(post._id, post.isApproved, index)}>{post.isApproved?'Unpublish':'Publish'}</button>
                                                    <button className="border-0 menuitem">Edit Post</button>
                                                    <button className="border-0 menuitem"  onClick={()=>handleDeletePost(post._id)}>Delete</button>
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {operation ? <tr><td className="position-absolute top-0 start-0 opacity-75 w-100 h-100 text-dark text-center align-middle bg-white"><i className="fa-solid fa-circle-notch fa-spin position-fixed top-50 start-50"></i></td></tr>:null}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
    } else {
        if(isLoading) {
            return (
              <i className="fa-solid fa-circle-notch fa-spin me-2 position-absolute" style={{top: `calc(${spinnerbound?.offsetHeight/2}px)`, right: `calc(${spinnerbound?.offsetWidth/2}px)`}}></i>
            )
        }else if(error?.message.startsWith('timeout')) {
            return (
                <h4>Network Timeout</h4>
            )
        }else{
            return (
                <p>Something terrible happened</p>
            )
        }
    }
}

export default Posts