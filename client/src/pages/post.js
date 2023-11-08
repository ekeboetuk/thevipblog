import { useState, memo } from 'react';
import { Link, useParams, ScrollRestoration } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';

import { Error } from '../components/errors';
import { usePosts } from '../hooks/fetchers';
import Meta from '../components/meta';
import RecentPosts from '../components/recentpost'

function Post({ token }) {
    const [comment, setComment] = useState();
    const [sending, setSending] = useState(false)
    const params = useParams();
    const {posts, error, isLoading} = usePosts(`/${params.slug}`);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setSending(true)
        const message = document.getElementById("message")
        message.style.fontWeight = "bold"
        message.innerHTML = "Please wait..."

        await axios
        .patch(process.env.REACT_APP_SERVER_URL + '/post/comment', {
            comment: comment,
            user: token?.id,
            post: params.slug,
            id: posts._id
        }, {
            headers: {
                Authorization: `Bearer ${document.cookie.split("; ").find(row=>row.startsWith('SessionToken='))?.split('=')[1]}`
            }
        })
        .then(()=>{
            message.innerHTML = '<span class="text-success">Comment successfully submitted. Will show up here after moderation!</span>';
            setComment('');
            setSending(false)
            setTimeout(()=>{
                message.innerHTML = "";
            }, 10000)
        },(error) => {
            message.innerHTML = `<span class="text-danger">${error.message}</span>`;
            setSending(false)
        })
    }

    let content;

    if(isLoading) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } else if(posts) {
        if(posts.length === 0 || !posts.isApproved){
            content = <Error status="404" document="Post" />
        }else if (!posts._id){
            content = <Error status="500" />
        } else {
            content=
                <>
                    <div className="d-flex align-items-center pb-3">
                        <img src="/assets/icon.png" alt="afriscope icon" className="square bg-tertiary rounded-circle p-1 me-3" />
                        <div className="align-items-center">
                            <div className="m-0 mb-2 lh-1 fs-2 fw-bold pe-4">{posts.title}</div>
                            <div className="d-flex flex-wrap justify-content-start me-4">
                                <h6 className="text-brand me-3 fs-8"><i className="fas fa-list me-1"></i>{posts.meta.category.charAt(0).toUpperCase() + posts.meta.category.slice(1)}</h6>
                                <h6 className="me-3 fs-8"><i className="fas fa-user me-1"></i>{(posts.meta.author.isActive && posts.meta.author?.name) || "Administrator"}</h6>
                                <h6 className="fs-8"><i className="fas fa-calendar-days me-1"></i>{moment(posts.timestamp).format("YYYY-MM-DD h:mm")}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 overflow-hidden"  style={{backgroundImage: `url(data:image/jpeg;base64,${btoa(new Uint8Array(posts.image.data.data).reduce(function (data, byte) {return data + String.fromCharCode(byte);}, ''))})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "300px", maxHeight:"300px" }}>
                    </div>
                    <div className="pt-4">{<div dangerouslySetInnerHTML={{ __html:posts.body.replace(/\s{1,}/gim, ' ')}} />}</div>
                    <div className="mt-2 bg-tertiary px-3">
                        <Meta id={posts._id} views={posts.meta.views} comments={posts.comments} likes={posts.meta.likes} />
                    </div>
                    <table className="table table-striped mb-0">
                        <tbody className="position-relative">
                        {posts.comments?.length > 0 && posts.comments.map((comment, index) => (
                            comment.approved &&
                            <tr key={index} id="comments" className="d-flex">
                                <td className="avatar flex-shrink-0 p-2 border-0">
                                    <img src="/assets/icon.png" className="bg-light p-2 rounded-circle" width = "50px" alt="Avatar"/>
                                </td>
                                <td className="d-flex flex-column flex-grow-1 justify-content-center p-2 border-0">
                                    <div className="fw-bold p-0">{token?.name === comment.user.name ? "You": (comment.user.isActive && comment.user._id === posts.meta.author._id?"Author":comment.user?.name) || "Anonymous"}</div>
                                    <div className="d-flex justify-content-between p-0" contentEditable={comment.user.name === token?.name ?"true":"false"} suppressContentEditableWarning>
                                        {comment.content}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {token?
                        <form id="commentform" name="commentform" className="postcomment mb-2 d-flex flex-column justify-content-right" onSubmit={handleCommentSubmit}>
                            <textarea id="comment" name="comment" className="px-3 py-2 mb-3 border border-1 border-tertiary rounded-0 bg-white" rows={8} cols={30} value={comment} onChange={(e)=> setComment(e.target.value)} disabled={sending} required />
                            <div className="d-flex flex-row">
                                <span id="message" className="me-auto fw-bold"></span>
                                <button type="submit" id="submit" className="btn btn-primary px-5 rounded-0 align-self-end" disabled={sending}>{sending ? <i className="fa-solid fa-circle-notch fa-spin"></i>:"Submit Comment"}</button>
                            </div>
                        </form>:
                        <div className="postcomment text-center mb-3 py-5 bg-light">
                            <p>Kindly login to contribute</p>
                            <Link to="/signin" className="btn btn-primary rounded-0 fw-bold" role="button"><i className="fas fa-right-to-bracket me-2"></i>Sign In</Link>
                        </div>
                    }
                        {posts.meta.tags &&
                            <>
                                <h6>Tags</h6>
                                <div className="d-flex flex-wrap py-3">
                                    {posts.meta.tags.split(", ").map((tag, index) => <Link to="#" key={index} className="rounded-pill px-4 py-2 me-2 mb-2 bg-tertiary text-body fw-semibold">{tag}</Link>)}
                                </div>
                            </>
                        }
                    <ScrollRestoration getKey={(location, matches) => {
                        return location.pathname;
                    }}/>
                </>
        }
    } else {
        if(error) {
            content = <Error status="500" />
        }else{
            content = <Error status="404" document="Post" />
        }
    }

    return (
        <>
            <div className={`container-sm d-grid justify-content-center my-5`}>
                {isLoading ? <img src="/assets/spinner_block.gif" width="60px" alt="loading" />:
                <div className={`${isLoading && "opacity-25"}`}>{content}</div>}
            </div>
            <div className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                <div className="container-md py-5">
                    <h6 className=" text-center text-uppercase text-white fw-bold mb-0 mx-md-3">Most Recent</h6>
                    <RecentPosts number={3} />
                </div>
            </div>
        </>
    )
}

export default memo(Post);