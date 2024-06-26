import { useState, useEffect, useContext, useRef, memo, lazy } from 'react';
import { createPortal } from 'react-dom'
import { Link, useParams, useLocation } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import DOMPurify from 'isomorphic-dompurify';
import { Helmet } from 'react-helmet-async';

import Modal from '../components/modal';
import Meta from '../components/meta';
import { Login } from "../components/users";
import { Error } from '../components/errors';
import { usePosts } from '../hooks/fetchers';
import { PostsCarousel } from '../components/carousels';
import { Advertise } from '../components/widgets'
import { Postcard } from '../components/cards';

import { userContext } from '../components/routes.js';

const Toast = lazy(()=>import ('../components/toasts'));

function Post({ token, unsetToken }) {
    const { state } = useLocation()
    const [commenting, setCommenting] = useState({edit:false, content:'', id:null});
    const [sending, setSending] = useState(false);
    const [portal, setPortal] = useState(false)
    const [authorsPosts, setAuthorsPosts] = useState(null);
    const params = useParams();
    const {posts, error, loading} = usePosts(`/${params.category}/${params.slug}?id=${state?.id}`);
	const {setToken} = useContext(userContext)
    const [toast, setToast] = useState({})
    const commentRef = useRef()
    let title

    useEffect(()=>{
        (async function(){
            await axios.get(process.env.REACT_APP_SERVER_URL + `/posts/author/?sort=-_id&postId=${posts?.id}&authorId=${posts?.meta.author.id}`)
            .then((response) => {
                setAuthorsPosts(response.data)
            })
            .catch(()=>{
                return null
            })
        })()
    },[posts?.id, posts?.meta.author.id])

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setSending(true)

        await axios
        .patch(process.env.REACT_APP_SERVER_URL + '/post/comment', {
            content: commenting.content,
            postId: posts._id,
            commentId: commenting.id
        }, {
            withCredentials: true,
        })
        .then((response)=>{
            setToast({...toast, state:true, color: '#FFFFFF', status: 'success', msg:response.data})
            setCommenting({edit:false, content:'', id: null});
            setSending(false)
        },(error) => {
            if(error.response && error.response.status < 500){
                setToast({...toast, state:true, color: '#FFFFFF', status: 'error', msg:`${error.response.data} Please login and try again.`})
                setSending(false)
                setTimeout(()=>{
                    unsetToken()
                }, 5000)
            }else{
                setToast({...toast, state:true, color: '#FFFFFF', status: 'warning', msg:'Network Error. Please check you internet and try again.'})
                setSending(false)
            }
        })
    }

    let content, tags, author, related

    if(loading){
        window.scrollTo({top:0,left:0,behavior:'smooth'})
        content =
        <div id="loading" className="d-flex flex-column flex-fill justify-content-start align-self-start pe-md-2 mb-5">
            <SkeletonTheme>
                <div className="d-inline-flex">
                    <Skeleton width="85px" height="100px" containerClassName="pe-3 mb-3" />
                    <div className="flex-fill" >
                        <Skeleton count={2.4} width="80%" height="25px" className="mb-1" />
                        <Skeleton width="25%" height="15px" inline={true} containerClassName="pe-2" />
                        <Skeleton width="25%" height="15px" inline={true} containerClassName="pe-2" />
                        <Skeleton width="25%" height="15px" />
                    </div>
                </div>
                <Skeleton height="300px" className="mb-1" />
                <Skeleton count={37.2} className="mb-1" />
            </SkeletonTheme>
        </div>
    }else if(posts) {
            title = posts.title.toLowerCase().split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
            content=
                <>
                    <div id="header" className="d-flex align-items-center pb-3">
                        <img src={`${posts.meta.author.avatar||'/assets/icon.png'}`} width={90} alt="afriscope icon" className="square bg-tertiary me-3 rounded align-self-start" />
                        <div className="align-items-center">
                            <h4 className="display-4 m-0 mb-2 lh-1 fw-bold">{posts.title.toUpperCase()}</h4>
                            <div className="d-flex flex-wrap justify-content-start me-4">
                                <h5 className="text-brand me-3 fs-8"><i className="fas fa-list me-1"></i>{posts.meta.category.charAt(0).toUpperCase() + posts.meta.category.slice(1)}</h5>
                                <h5 className="me-3 fs-8"><i className="fas fa-user me-1"></i>{(posts.meta.author.isActive && posts.meta.author?.name) || "Administrator"}</h5>
                                <h5 className="fs-8"><i className="fas fa-calendar-days me-1"></i>{moment(posts.created).format("YYYY-MM-DD h:mm")}</h5>
                            </div>
                        </div>
                    </div>
                    {posts.meta.description &&
                        <div id="metadesc">
                            <h4 className="border-left">Meta Description</h4>
                            <p className="fw-bold text-black-50">{posts.meta.description}</p>
                        </div>
                    }
                    <img src={posts.image} style={{width: "100%", height: "400px", objectFit: "cover"}} className="shadow" alt={posts.meta.description}/>
                    <p id="intro" className="my-4 fw-semibold">
                        {posts.intro}
                    </p>
                    <div id="content" className="text-body" dangerouslySetInnerHTML={{ __html:DOMPurify.sanitize(posts.body.replace(/\s{1,}/gim, ' '))}} />
                    <div className="d-flex flex-column border rounded-4">
                        <div id="engagements" className="bg-tertiary px-3">
                            <Meta slug={posts.slug} id={posts._id} meta={posts.meta} comments={posts.comments} />
                        </div>
                        <table id="comments" className="table table-striped mb-0">
                            <tbody className="position-relative">
                            {posts.comments?.length > 0 && posts.comments.map((comment, index) => (
                                comment.approved &&
                                <tr key={index} className="d-flex">
                                    <td className="avatar flex-shrink-0 p-2 border-0">
                                        <img src={`${(comment.user?.isActive && comment.user?.avatar)||"/assets/icon.png"}`} className="bg-light p-2 rounded-circle" width = "50px" height="50px" alt="Avatar"/>
                                    </td>
                                    <td className="d-flex flex-column flex-grow-1 justify-content-center p-2 border-0">
                                        <div className="fw-bold p-0">{token?.id === comment.user?._id ? "You": (comment.user?.isActive && comment.user?._id === posts.meta.author._id?"Author":comment.user?.isActive && comment.user?.name) || "Anonymous"}</div>
                                            {comment.content}
                                            <div className="d-flex flex-row align-self-start">
                                                {token && commenting.edit !== true && token?.name === comment?.user.name && <div className="border border-1 rounded-pill px-3 me-2 fs-6" role="button" onClick={(e)=>{setCommenting({...commenting, edit: true, content: comment.content, id: comment.id}); commentRef.current.scrollIntoView(false)}}>Edit</div>}
                                                {token && <div className="border border-1 rounded-pill px-3 fs-6" role="button">Reply</div>}
                                            </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {token?
                        <form id="commentform" ref={commentRef} name="commentform" className="postcomment mt-2 d-flex flex-column justify-content-right" onSubmit={handleCommentSubmit}>
                            <textarea id="comment" name="comment" className="px-3 py-2 mb-3 border border-1 rounded-4 bg-white" rows={5} cols={30} value={commenting.content} onChange={(e)=> setCommenting({...commenting, content: e.target.value})} disabled={sending} autoComplete="off" required />
                            <div className="d-flex flex-column flex-md-row">
                                <span id="message" className="me-auto "></span>
                                <button type="submit" id="submit" className="btn-primary border-0 text-white py-2 px-5 text-nowrap rounded-0 align-selft-stretch align-self-md-start" disabled={sending}>{sending ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait!</>:commenting.edit?"Update Comment":"Submit Comment"}</button>
                            </div>
                        </form>:
                        <div className="postcomment text-center mt-2 mb-5 py-5 bg-light rounded-4">
                            <p>Kindly login to contribute</p>
                            <button onClick={()=>{setPortal(true)}} className="btn btn-primary rounded-0 fw-bold"><i className="fas fa-right-to-bracket me-2"></i>Login</button>
                            {portal &&
                                createPortal(
                                    <Modal onClick={()=>setPortal(false)}>
                                        <Login setToken={setToken} setPortal={setPortal} />
                                    </Modal>,
                                    document.body
                                )
                            }
                        </div>
                    }
                </>
            tags =
                posts.meta.tags !== undefined ?
                    <>
                        <div className="d-flex flex-wrap mb-3">
                            {posts.meta.tags.map((tag, index) => <Link to={`/search?${new URLSearchParams(`q=${encodeURIComponent(`"${tag}"`)}`)}`} key={index} className="rounded-pill px-4 py-1 me-2 mb-2 bg-tertiary text-body fs-5 shadow-sm">{tag}</Link>)}
                        </div>
                    </>:"No Tags"
            author =
                <div className="mb-5">
                    <h4 className="text-uppercase">About The Author</h4>
                    <p>{posts.meta.author?.about?posts.meta.author.about:posts.meta.author.name}</p>
                </div>
    }else if(error){
        document.title = `Afriscope Blog - ${error.message}`
        if(error.response?.status === 404){
            content = <Error status={404} element="Post" />
        }else {
            content = <Error status={500} element="Post" />
        }
        related = "There Seems To Be An Issue. Please Try Again"
    }

    return (
        <>
            <Helmet prioritizeSeoTags>
                <title>{`Afriscope Blog - ${title}`}</title>
                <meta name="description" content={title} data-rh="true" />

                <meta property="og:description" content={title} data-rh="true" />
                <meta property="og:type" content="article" data-rh="true" />
                <meta property="og:url" content={window.location.href} data-rh="true" />
                <meta property="og:image" content={posts?.image} data-rh="true" />

                <meta name="twitter:description" content={title} data-rh="true" />
                <meta name="twitter:card" content="article" data-rh="true" />
                <meta property="twitter:url" content={window.location.href} data-rh="true" />
                <meta name="twitter:image" content={posts?.image} data-rh="true" />
            </Helmet>
            <section className={`container-md d-flex flex-column flex-md-row`}>
                <div id="post" className={`${loading?"opacity-25":""} col-12 col-md-8 p-md-4`}>
                    {content}
                    <div className="d-flex flex-column align-items-center position-fixed top-50 start-0 fs-1 ms-2 rounded">
                        <Link to="#" className="text-brand"><i className="fa-brands fa-facebook-f pt-3 pb-2"></i></Link>
                        <Link to="#" className="text-brand"><i className="fa-brands fa-twitter py-2"></i></Link>
                        <Link to="#" className="text-brand"><i className="fa-brands fa-instagram pt-2 pb-3"></i></Link>
                    </div>
                </div>
                <div id="sidebar" className="col-12 col-md-4 d-flex flex-column align-items-start ps-0 p-md-4" >
                    <Advertise title="Advertise Here" content={{quote: "Advertise you products here at an affordable rate", name: "Afriscope"}}/>
                    <div className="w-100 mb-5">
                        <h4>Tags</h4>
                        {loading?
                            <SkeletonTheme>
                                <Skeleton inline={true} width="20%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="60%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="40%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="50%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="80%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="10%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="100%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="50%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="45%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="25%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="70%" containerClassName="pe-2" />
                                <Skeleton inline={true} width="80%" containerClassName="" />
                            </SkeletonTheme>:
                            tags
                        }
                    </div>
                    {author}
                    {posts &&
                        <>
                            <h4>{`More From ${posts.meta?.author.name.split(" ")[0]}`}</h4>
                            {authorsPosts === null?
                                <>
                                    <div className="d-flex flex-row row-cols-2 w-100 mb-4">
                                        <Skeleton height="100%" className="col lh-base"/>
                                        <div className="col bg-tertiary px-2 py-4 lh-1">
                                            <Skeleton  count ={1.8} width="100%" height="12px" className="mb-2" />
                                            <Skeleton width="40%" height="12px" />
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row row-cols-2 w-100 mb-4">
                                        <Skeleton height="100%" className="col lh-base"/>
                                        <div className="col bg-tertiary px-2 py-4 lh-1">
                                            <Skeleton  count ={1.8} width="100%" height="12px" className="mb-2" />
                                            <Skeleton width="40%" height="12px" />
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row row-cols-2 w-100 mb-4">
                                        <Skeleton height="100%" className="col lh-base"/>
                                        <div className="col bg-tertiary px-2 py-4 lh-1">
                                            <Skeleton  count ={1.8} width="100%" height="12px" className="mb-2" />
                                            <Skeleton width="40%" height="12px" />
                                        </div>
                                    </div>
                                </>:
                                (authorsPosts?.length !== 0 ?
                                    <div id="author" className="col-12 row row-cols-1">
                                        {authorsPosts.slice(0,4).map((post) =>
                                            <div key={post._id} className="col d-flex flex-row pb-4 align-self-start transition">
                                                <Postcard
                                                    id={post._id}
                                                    slug={post.slug}
                                                    image={post.image}
                                                    imgWidth='60%'
                                                    height="70px"
                                                    title={post.title}
                                                    comments={post.comments}
                                                    meta={post.meta}
                                                    category={post.meta.category}
                                                    created={post.created}
                                                    showCategory={false}
                                                    showMeta={false}
                                                    showReadmore={false}
                                                    showEngagement={false}
                                                    font="1.2rem"
                                                />
                                            </div>
                                        )}
                                    </div>:
                                    <p>Working On Something!</p>
                                )
                            }
                        </>
                    }
                </div>
            </section>
            {related?.length>0 &&
                <section className="d-flex flex-column text-dark">
                    {typeof related !== "string"?<PostsCarousel count={4} limit={4} title="Related Posts" autoplay={true} query={posts?.meta.tags} postId={posts?.id} />:<div className="text-center text-dark">{related}</div>}
                </section>
            }
            {toast.state &&
                <Toast toast={toast} setToast={setToast} position="top-left">
                    {toast.msg}
                </Toast>
            }
        </>
    )
}

export default memo(Post);