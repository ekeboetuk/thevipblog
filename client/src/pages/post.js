import { useState, memo } from 'react';
import { Link, useParams, ScrollRestoration } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';

import { usePosts } from '../hooks/fetchers';
import RecentPosts from '../components/recentposts'
import Meta from '../components/meta';

function Post({ token }) {
    const [comment, setComment] = useState();
    const [sending, setSending] = useState(false)
    const params = useParams();
    const [post, isError, isLoading] = usePosts(`/${params.slug}`);

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
            id: post._id
        })
        .then(()=>{
            message.innerHTML = '<span class="text-success">Comment successfully submitted. Will show up here after moderation!</span>';
            setComment('');
            setSending(false)
            setTimeout(()=>{
                message.innerHTML = "";
            }, 10000)
        })
        .catch((error) => {
            message.innerHTML = '<span class="text-danger">Comment Failed, Try Again!</span>';
            setSending(false)
        })
    }

    let content;

    if(isLoading) {
        content =
            <div className="text-center">
                <img src="/assets/spinner_block.gif" className="mt-5 pt-5" width="60px" alt="loading" />
            </div>
    } else if(isError) {
        content=
        <div className="text-center">
            <img src="/media/awsnapidle.webp" width="60px" className="py-3" alt="awsnap" />
            <h6>Aw snap! Currently unable to fetch posts.</h6>
            <h6 className='text-danger fs-8'>{isError.message}</h6>
        </div>
    } else {
        if(post.length === 0){
            content=
            <div className="text-center mb-5 py-5">
                <h5 className="fw-semibold">Post not found</h5>
                <p>Oops! The post you are looking for does not exist. it might have been moved or deleted</p>
                <Link className="text-white btn-primary rounded-9 px-3 pt-2 pb-1 fw-semibold" to="/" type="button"><i className="fas fa-home pe-2"></i>Back to home</Link>
            </div>
        }else{
            content=
            <>
                <div className="d-flex align-items-center pb-3">
                    <img src="/assets/icon.png" alt="afriscope icon" className="square bg-tertiary rounded-circle p-1 me-3" />
                    <div className="align-items-center">
                        <div className="m-0 mb-2 lh-1 fs-2 fw-bold pe-4">{post.title}</div>
                        <div className="d-flex flex-wrap justify-content-start me-4">
                            <h6 className="text-brand me-3 fs-8"><i className="fas fa-list me-1"></i>{post.meta.category.charAt(0).toUpperCase() + post.meta.category.slice(1)}</h6>
                            <h6 className="me-3 fs-8"><i className="fas fa-edit me-1"></i>{(post.meta.author.isActive && post.meta.author?.name) || "Administrator"}</h6>
                            <h6 className="fs-8"><i className="fas fa-clock me-1"></i>{moment(post.timestamp).format("YYYY-MM-DD h:mm")}</h6>
                        </div>
                    </div>
                </div>
                <div className="w-100 overflow-hidden"  style={{backgroundImage: `url(data:image/jpeg;base64,${btoa(new Uint8Array(post.image.data.data).reduce(function (data, byte) {return data + String.fromCharCode(byte);}, ''))})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "500px"}}>
                </div>
                <div className="pt-4">{<div dangerouslySetInnerHTML={{ __html:post.body}} />}</div>
                <div className="mt-2 bg-tertiary px-3">
                    <Meta id={post._id} views={post.meta.views} comments={post.comments} likes={post.meta.likes} />
                </div>
                <table className="table table-striped mb-0">
                    <tbody className="position-relative">
                    {post.comments?.length > 0 && post.comments.map((comment, index) => (
                        comment.approved &&
                        <tr key={index} id="comments" className="d-flex">
                            <td className="avatar flex-shrink-0 p-2 border-0">
                                <img src="/assets/icon.png" className="bg-light p-2 rounded-circle" width = "50px" alt="Avatar"/>
                            </td>
                            <td className="d-flex flex-column flex-grow-1 justify-content-center p-2 border-0">
                                <div className="fw-bold p-0">{token?.name === comment.user.name ? "You": (comment.user.isActive && comment.user._id === post.meta.author._id?"Author":comment.user?.name) || "Anonymous"}</div>
                                <div className="d-flex justify-content-between p-0">
                                    {comment.content}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {token?
                    <form id="commentform" name="commentform" className="postcomment mb-2 d-inline-flex flex-column justify-content-right" onSubmit={handleCommentSubmit}>
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
                <ScrollRestoration getKey={(location, matches) => {
                    return location.pathname;
                }}/>
            </>
        }
    }

    return (
        <>
            <div className="container-sm d-grid my-5">
                {content}
            </div>
            <div className="container-fluid d-flex flex-column bg-tertiary">
                <div className="container-md d-grid">
                <h6 className=" text-center text-uppercase fw-bold pt-4 mb-0 mx-md-3">Recent Posts</h6>
                    <RecentPosts number={4} />
                </div>
            </div>
        </>
    )
}

export default memo(Post);