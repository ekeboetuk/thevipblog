import { useState, useEffect, useContext, useRef, memo } from 'react';
import { createPortal } from 'react-dom'
import { Link, useParams, useLocation } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import DOMPurify from 'isomorphic-dompurify';

import Modal from '../components/modal';
import { Login } from "../components/users";
import { Error } from '../components/errors';
import { usePosts } from '../hooks/fetchers';
import Meta from '../components/meta';
import { PostsCarousel } from '../components/carousels';
import { Advertise, Subscribe } from '../components/widgets'
import { Postcard } from '../components/cards';

import { userContext } from '../index';

function Post({ token, unsetToken }) {
    const { state } = useLocation()
    const [commenting, setCommenting] = useState({edit:false, content:'', id:null});
    const [sending, setSending] = useState(false);
    const [portal, setPortal] = useState(false)
    const [authorsPosts, setAuthorsPosts] = useState(null);
    const params = useParams();
    const {posts, error, loading} = usePosts(`/${params.category}/${params.slug}?id=${state?.id}`);
	const {setToken} = useContext(userContext)
    const commentRef = useRef()

    useEffect(()=>{
        (async function(){
            await axios.get(process.env.REACT_APP_SERVER_URL + `/posts/author/?sort=-_id&postId=${posts?.id}&authorId=${posts?.meta.author.id}`)
            .then((response) => {
                setAuthorsPosts(response.data)
            })
            .catch((error)=>{
                console.log(error)
            })
        })()
    },[posts?.id, posts?.meta.author.id])

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setSending(true)
        const message = document.getElementById("message")
        message.style.fontWeight = "bold"
        message.innerHTML = "Please wait..."

        await axios
        .patch(process.env.REACT_APP_SERVER_URL + '/post/comment', {
            content: commenting.content,
            postId: posts._id,
            commentId: commenting.id
        }, {
            withCredentials: true,
        })
        .then((response)=>{
            message.innerHTML = `<span class="text-success pe-4 fs-5">${response.data}</span>`;
            setCommenting({edit:false, content:'', id: null});
            setSending(false)
            setTimeout(()=>{
                message.innerHTML = "";
            }, 10000)
        },(error) => {
            if(error.response){
                message.innerHTML = `<span class="text-danger pe-4 fs-5">${error.response.data} Please login and try again.</span>`;
                setSending(false)
                setTimeout(()=>{
                    unsetToken()
                }, 5000)
            }else if(error.request){
                message.innerHTML = `<span class="text-danger pe-4 fs-5">Network Error. Please check you internet try again.</span>`;
                setSending(false)
                setTimeout(()=>{
                    message.innerHTML = "";
                }, 5000)
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
                    <Skeleton width="85px" height="100px" containerClassName="pe-3" />
                    <div className="flex-fill" >
                        <Skeleton count={2.4} width="80%" height="25px" />
                        <Skeleton width="25%" height="15px" inline={true} containerClassName="pe-2" />
                        <Skeleton width="25%" height="15px" inline={true} containerClassName="pe-2" />
                        <Skeleton width="25%" height="15px" />
                    </div>
                </div>
                <Skeleton height="300px" />
                <Skeleton count={37.2} />
            </SkeletonTheme>
        </div>
    }else if(posts) {
            let title = posts.title.toLowerCase().split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
            document.title = `Afriscope Blog - ${title}`
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
                        <div id="metadesc" className="my-4">
                            <h4 className="border-left">Meta Description</h4>
                            <p style={{fontWeight: 800}}>{posts.meta.description}</p>
                        </div>
                    }
                    <img src={posts.image} style={{width: "100%", height: "400px", objectFit: "cover"}} className="shadow" alt={posts.meta.description}/>
                    <div id="intro" className="my-4">
                        <p style={{fontSize: "1.7rem", fontWeight: 800}}>{posts.intro}</p>
                    </div>
                    <div id="content" className="pt-4">{<div dangerouslySetInnerHTML={{ __html:DOMPurify.sanitize(posts.body.replace(/\s{1,}/gim, ' '))}} />}</div>
                    <div id="comments" className="mt-2 bg-tertiary px-3">
                        <Meta slug={posts.slug} id={posts._id} meta={posts.meta} comments={posts.comments} />
                    </div>
                    <table className="table table-striped mb-0">
                        <tbody className="position-relative">
                        {posts.comments?.length > 0 && posts.comments.map((comment, index) => (
                            comment.approved &&
                            <tr key={index} id="comments" className="d-flex">
                                <td className="avatar flex-shrink-0 p-2 border-0">
                                    <img src={`${(comment.user?.isActive && comment.user?.avatar)||"/assets/icon.png"}`} className="bg-light p-2 rounded-circle" width = "50px" height="50px" alt="Avatar"/>
                                </td>
                                <td className="d-flex flex-column flex-grow-1 justify-content-center p-2 border-0">
                                    <div className="fw-bold p-0">{token?.id === comment.user?._id ? "You": (comment.user?.isActive && comment.user?._id === posts.meta.author._id?"Author":comment.user?.isActive && comment.user?.name) || "Anonymous"}</div>
                                        {comment.content}
                                        <div className="d-inline-flex align-self-end">
                                            {token && commenting.edit !== true && token?.name === comment?.user.name && <div className="border border-1 rounded-pill px-3 me-2 fs-6" role="button" onClick={(e)=>{setCommenting({...commenting, edit: true, content: comment.content, id: comment.id}); commentRef.current.scrollIntoView(false)}}>Edit</div>}
                                            {token && <div className="border border-1 rounded-pill px-3 fs-6" role="button">Reply</div>}
                                        </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {token?
                        <form id="commentform" ref={commentRef} name="commentform" className="postcomment mb-5 d-flex flex-column justify-content-right" onSubmit={handleCommentSubmit}>
                            <textarea id="comment" name="comment" className="px-3 py-2 mb-3 border border-1 border-tertiary rounded-0 bg-white" rows={8} cols={30} value={commenting.content} onChange={(e)=> setCommenting({...commenting, content: e.target.value})} disabled={sending} autoComplete="off" required />
                            <div className="d-flex flex-column flex-md-row">
                                <span id="message" className="me-auto "></span>
                                <button type="submit" id="submit" className="btn-primary border-0 text-white py-2 px-5 text-nowrap rounded-0 align-selft-stretch align-self-md-start" disabled={sending}>{sending ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Submitting</>:commenting.edit?"Update Comment":"Submit Comment"}</button>
                            </div>
                        </form>:
                        <div className="postcomment text-center mb-5 py-5 bg-light">
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
                            {posts.meta.tags.map((tag, index) => <Link to={`/search?${new URLSearchParams(`q=${encodeURIComponent(`"${tag}"`)}`)}`} key={index} className="rounded-pill px-4 py-1 me-2 mb-2 bg-tertiary text-body fw-semibold fs-5 shadow-sm">{tag}</Link>)}
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
            <section className={`container-md d-flex flex-column flex-md-row`}>
                <div id="post" className={`${loading?"opacity-25":""}col-12 col-md-9 pe-0 pe-md-5`}>
                    {content}
                    <div className="d-flex flex-column align-items-center position-fixed top-50 start-0 fs-1 ms-2 rounded">
                        <Link to="#" className="text-brand"><i className="fa-brands fa-facebook-f pt-3 pb-2"></i></Link>
                        <Link to="#" className="text-brand"><i className="fa-brands fa-twitter py-2"></i></Link>
                        <Link to="#" className="text-brand"><i className="fa-brands fa-instagram pt-2 pb-3"></i></Link>
                    </div>
                </div>
                <div className="col-12 col-md-3 d-flex flex-column align-items-start" >
                    <Advertise title="Advertise Here" content={{quote: "Advertise you products here at an affordable rate", name: "Afriscope"}}/>
                    <div className="w-100 mb-5">
                        <h5 className="fw-bolder text-uppercase mb-4">Tags</h5>
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
                    <div className="" style={{position: "sticky", top: "70px", marginBottom: "0"}}>
                        <Subscribe />
                    </div>
                </div>
            </section>
            <section className="container-md">
                {posts &&
                    <>
                        <h4 className="text-uppercase mb-4">{`More From ${posts.meta?.author.name.split(" ")[0]}`}</h4>
                        {authorsPosts === null?
                            <div className="fst-italic"><i className="fa-solid fa-rotate-right fa-spin"></i>Loading</div>:
                            (authorsPosts?.length !== 0 ?
                                <div id="author" className="col-12 row row-cols-1 row-cols-md-3">
                                    {authorsPosts.slice(0,6).map((post) =>
                                        <div key={post._id} className="col d-flex flex-row pb-5 align-self-start transition">
                                            <Postcard
                                                id={post._id}
                                                slug={post.slug}
                                                image={post.image}
                                                height="100px"
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
                                <p className="container-md">Working On Something!</p>
                            )
                        }
                    </>
                }
            </section>
            <section className="container-fluid d-flex flex-column" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                {typeof related !== "string"?<PostsCarousel count={3} limit={4} title="Related Posts" autoplay={true} query={posts?.meta.tags} postId={posts?.id} />:<div className="text-center text-white">{related}</div>}
            </section>
        </>
    )
}

export default memo(Post);