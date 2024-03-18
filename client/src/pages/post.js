import { useState, memo } from 'react';
import { Link, useParams, useLocation, ScrollRestoration } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';

import { Error } from '../components/errors';
import { usePosts } from '../hooks/fetchers';
import Meta from '../components/meta';
import RecentPosts from '../components/recentpost';
import { Advertise, Subscribe } from '../components/widgets'

function Post({ token }) {
    const [comment, setComment] = useState();
    const [sending, setSending] = useState(false)
    const params = useParams();
    const { state } = useLocation()
    const {posts, error, isLoading} = usePosts(`/${state.id}`);

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
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${document.cookie.split("; ").find(row=>row.startsWith('authorization_token='))?.split('=')[1]}`
            }
        })
        .then(()=>{
            message.innerHTML = '<span class="text-success pe-4 fs-5">Comment successfully submitted. Will show up here after moderation!</span>';
            setComment('');
            setSending(false)
            setTimeout(()=>{
                message.innerHTML = "";
            }, 10000)
        },(error) => {
            message.innerHTML = `<span class="text-danger pe-4 fs-5">${error.response.data}</span>`;
            setSending(false)
            setTimeout(()=>{
                message.innerHTML = "";
            }, 5000)
        })
    }

    let content;

    if(isLoading) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } else if(posts) {
        if(posts.length === 0 || !posts.isApproved){
            content = <Error status="404" document="Post" />
            document.title = "Afriscope Blog - Not Found"
        }else if (!posts._id){
            content = <Error status="500" />
            document.title = "Afriscope Blog - Internal Server Error"
        } else {
            let title = posts.title.toLowerCase().split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
            document.title = `Afriscope Blog - ${title}`
            content=
                <>
                    <div className="d-flex align-items-center pb-3">
                        <img src={`${posts.meta.author.image||'/assets/icon.png'}`} width={90} alt="afriscope icon" className="square bg-tertiary me-3 rounded align-self-start" />
                        <div className="align-items-center">
                            <h4 className="display-4 m-0 mb-2 lh-1 fw-bold">{posts.title.toUpperCase()}</h4>
                            <div className="d-flex flex-wrap justify-content-start me-4">
                                <h5 className="text-brand me-3 fs-8"><i className="fas fa-list me-1"></i>{posts.meta.category.charAt(0).toUpperCase() + posts.meta.category.slice(1)}</h5>
                                <h5 className="me-3 fs-8"><i className="fas fa-user me-1"></i>{(posts.meta.author.isActive && posts.meta.author?.name) || "Administrator"}</h5>
                                <h5 className="fs-8"><i className="fas fa-calendar-days me-1"></i>{moment(posts.created).format("YYYY-MM-DD h:mm")}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 overflow-hidden"  style={{backgroundImage: `url(${posts.image})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "300px", maxHeight:"300px" }}>
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
                                    <img src={`${comment.user.image||"/assets/icon.png"}`} className="bg-light p-2 rounded-circle" width = "50px" alt="Avatar"/>
                                </td>
                                <td className="d-flex flex-column flex-grow-1 justify-content-center p-2 border-0">
                                    <div className="fw-bold p-0">{token?.id === comment.user?._id ? "You": (comment.user?.isActive && comment.user?._id === posts.meta.author._id?"Author":comment.user?.name) || "Anonymous"}</div>
                                    <div className="d-flex justify-content-between p-0" contentEditable={comment.user?.name === token?.name ?"true":"false"} suppressContentEditableWarning>
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
                            <div className="d-flex flex-column flex-md-row">
                                <span id="message" className="me-auto "></span>
                                <button type="submit" id="submit" className="btn-primary border-0 text-white py-2 px-5 text-nowrap rounded-0 align-selft-stretch align-self-md-start" disabled={sending}>{sending ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Submitting</>:"Submit Comment"}</button>
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
                    <h4 className="pt-5 text-uppercase">{`More From ${posts.meta.author.name}`}</h4>
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
            <section className={`container-md d-flex flex-column flex-md-row my-5 gap-4`}>
                {isLoading ? <div className="col-12 d-flex justify-content-center"><img src="/assets/spinner_block.gif" height="60px" width="60px" alt="loading" /></div>:
                <div className={`${isLoading && "opacity-25"} col-12 col-md-9 pe-0 pe-md-5`}>
                    {content}
                </div>}
                {content && <div className="col-12 col-md-3 d-flex flex-column gap-5 align-items-start" >
                        <Advertise />
                        <div>
                            <h5 className="fw-bolder text-uppercase px-1 mb-3">Trending</h5>
                            <RecentPosts number={1} />
                        </div>
                        <div>
                            <h5 className="fw-bolder text-uppercase px-1">Tags</h5>
                            {posts?.meta.tags !== undefined ?
                                <>
                                    <div className="d-flex flex-wrap py-3">
                                        {posts.meta.tags.split(", ").map((tag, index) => <Link to="#" key={index} className="rounded-pill px-4 py-1 me-2 mb-2 bg-tertiary text-body fw-semibold fs-5">{tag}</Link>)}
                                    </div>
                                </>:""
                            }
                        </div>
                        <Subscribe />
                        <div>
                            <h4 className="text-uppercase">About The Author</h4>
                            <p>{posts.meta.author?.about?posts.meta.author.about:posts.meta.author.name}</p>
                        </div>
                    </div>
                }
            </section>
            <section className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                <div className="container-md py-5">
                    <h5 className=" text-center text-uppercase text-white fw-bold mb-5 mx-md-3">Related Posts</h5>
                    <RecentPosts number={4} showMeta={true}/>
                </div>
            </section>
        </>
    )
}

export default memo(Post);