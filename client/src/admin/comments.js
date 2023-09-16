import { useState } from 'react';

import { Link } from 'react-router-dom';

import { usePosts } from '../hooks/fetchers';
import { Empty } from '../components/errors'
import axios from 'axios';

function Comments() {
    const [sortby, setSortby] = useState("_id");
    const {posts, error, isLoading, mutate} = usePosts(`s?sortby=${sortby}`)
    const [search, setSearch] = useState("");
    const [actionmenu, setActionmenu] = useState({})
    const [operation, setOperation] = useState();
    const [select, setSelect] = useState({})

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
            return (
               <Empty text="No Comments Found" />
            )
        }else{
            return (
                <div className={`position-relative flex-fill`}>{isLoading && <i className="fa-solid fa-circle-notch fa-spin me-2 position-absolute" style={{left: "30vw", top: "40vh"}}></i>}
                    <div className={`${isLoading && "opacity-25"} mb-0 pe-md-0`} onClick={()=>setActionmenu({})}>
                    <input type="text" id="search" className="w-100 bg-light mb-3 px-3 py-1" value={search} onChange={(e)=>handleSearch(e)} placeholder="Ajax Search" />
                    </div>
                    <table className={`table table-striped table-hover`}>
                        <thead>
                            <tr>
                                <th className="align-text-bottom"><input type="checkbox" id="checkall" name="checkall" value={select} onChange={()=>setSelect(!select)} /></th>
                                <th>Comment</th>
                                <th>User</th>
                                <th>Post</th>
                            </tr>
                        </thead>
                        <tbody className="position-relative">
                            {posts?.map((post, postIndex) => (
                                post.comments.map((comment, commentIndex) => (
                                    <tr key={commentIndex} className={`${!comment.approved && "opacity-50"}`}>
                                        <td><input type="checkbox" id={comment._id} name={comment._id} value={select[`${postIndex}${commentIndex}`]} onChange={()=>setSelect({...select, [`${postIndex}${commentIndex}`]: !select[`${postIndex}${commentIndex}`]})} /></td>
                                        <td className="align-middle">{comment.user?.name||"Administrator"}</td>
                                        <td className="align-middle">{comment.content}</td>
                                        <td className="align-middle">{post.title}</td>
                                    </tr>
                            ))))}
                        </tbody>
                    </table>
                </div>
            )}
    } else {
        if(isLoading) {
            return (
                <div className={`position-relative`}>
                    <i className="fa-solid fa-circle-notch fa-spin me-2 position-absolute" style={{left: "30vw", top: "40vh"}}></i>
                </div>
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

export default Comments