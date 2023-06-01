import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

import moment from 'moment';

import { Link, useParams } from 'react-router-dom';

import { Postcard } from '../components/cards';
import Meta from '../components/meta';

function Post() {
    const [post, setPost] = useState();
    const [posts, setPosts] = useState();
    const [form, activateForm] = useState(false);
    const [comment, setComment] = useState();
    const params = useParams();

    const userToken = JSON.parse(localStorage.getItem("token"))

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        document.getElementById("comment").disabled = true
        document.getElementById("submit").disabled = true

        const message = document.getElementById('message')

        await axios
        .patch(`http://localhost:3001/post/newcomment`, {
            comment: comment,
            user: userToken?.id,
            post: params.id
        })
        .then(()=>{
            setTimeout(()=>{
                message.innerHTML = "Comment successfully submitted. Kindly wait for moderation!";
                setComment('');
            }, 5000);
            setTimeout(()=>{
                message.innerHTML = "";
                document.getElementById("comment").disabled = false;
                document.getElementById("submit").disabled = false;
            }, 10000)
        })
        .catch((error) => {
            document.getElementById('pmessage').style.fontColor = "red"
            setTimeout(()=>{
                message.innerHTML = "Comment Failed, Try Again!"
            }, 2000)
        })
        message.style.fontWeight = "bold"
        message.innerHTML = "Please wait..."
    }


    const handleCommentDelete = async (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        const postPromise = axios.get(`http://localhost:3001/post/${params.id}`);
        const postsPromise = axios.get(`http://localhost:3001/posts`);

        Promise.all([postPromise, postsPromise])
        .then((response) => {
            const post = response[0].data
            if(post._id) {
                setPost(
                    <>
                        <div className="d-flex align-items-center pb-3">
                            <img src="/assets/icon.png" alt="afriscope icon" className="square bg-tertiary rounded-circle p-1 me-3" />
                            <div className="align-items-center">
                                <div className="m-0 mb-2 lh-1 fs-2 fw-bold pe-4">{post.title}</div>
                                <div className="d-flex flex-wrap justify-content-start me-4">
                                    <h6 className="text-brand me-3 fs-8"><i className="fas fa-list me-1"></i>{post.meta.category.charAt(0).toUpperCase() + post.meta.category.slice(1)}</h6>
                                    <h6 className="me-3 fs-8"><i className="fas fa-edit me-1"></i>{post.meta.author.name}</h6>
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
                        <tbody>
                        {post.comments.length > 0 && post.comments.map((comment, index) => (
                            comment.approved &&
                            <tr key={index} id="comments" className="d-flex">
                                <td className="avatar flex-shrink-0 p-2 border-0">
                                    <img src="/assets/icon.png" className="bg-light p-2 rounded-circle" width = "50px" alt="Avatar"/>
                                </td>
                                <td className="d-flex flex-column flex-grow-1 justify-content-center p-2 border-0">
                                    <div className="fw-bold p-0">{comment.user.name}</div>
                                    <div className="d-flex justify-content-between p-0">
                                        {comment.content}
                                        {userToken?.isAdmin && <button className="fas fa-trash fs-8 bg-transparent border-0 link-light" onClick={handleCommentDelete}></button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                    </>
                );
                activateForm(true)
            }else{
                setPost (
                    <div className="text-center mb-5 py-5">
                        <h5 className="fw-semibold">Post not found</h5>
                        <p>Oops! The post you are looking for does not exist. it might have been moved or deleted</p>
                        <Link className="text-white btn-primary rounded-9 px-3 pt-2 pb-1 fw-semibold" to="/" type="button"><i className="fas fa-home pe-2"></i>Back to home</Link>
                    </div>
                )}

            response[1].data.length &&
                setPosts(
                    <>
                    <h6 className="text-center text-uppercase fw-bold">Recent Posts</h6>
                    <div className="row row-cols-md-3 row-cols-lg-4 p-0 p-md-4">
                        {response[1].data.slice(-4,).toReversed().map((posts) => (
                            <div key={posts._id} className="col g-4 gx-md-4 gy-md-0">
                                <Postcard
                                    id={posts._id}
                                    image={posts.image}
                                    title={`${posts.title.split(" ").splice(0, 6).join(" ")}...`}
                                    comments={posts.comments}
                                    meta={posts.meta}
                                    created={posts.created}
                                    height="180px"
                                />
                            </div>
                        ))}
                    </div>
                    </>
                )
            })
          .catch(() => {
            setPosts(
                <div className="text-center">
                    <img src="/media/awsnapidle.webp" width="60px" className="py-3" alt="awsnap" />
                    <h6>Aw snap! Currently unable to fetch posts.</h6>
                </div>
            )
          });
          activateForm(false)
          setPost(
            <div className="text-center">
                <img src="/assets/spinner_block.gif" className="mt-5 pt-5" width="60px" alt="loading" />
            </div>
          )
        window.scrollTo(0, 0);
      }, [params, userToken?.isAdmin]);

    return (
        <>
            <div className="container-sm d-grid my-5">
                {post}
                {
                    form?
                        userToken?
                            <form id="commentform" name="commentform" className="postcomment mb-2 d-inline-flex flex-column justify-content-right" onSubmit={handleCommentSubmit}>
                                <textarea id="comment" name="comment" className="px-3 py-2 mb-3 border-tertiary rounded-0 bg-white" rows={8} cols={30} value={comment} onChange={(e)=> setComment(e.target.value)} required />
                                <div className="d-flex flex-row">
                                    <span id="message" className="me-auto"></span>
                                    <button type="submit" id="submit" className="btn btn-primary px-5 rounded-0 align-self-end">Submit Comment</button>
                                </div>
                            </form>:
                            <div className="postcomment text-center mb-3 py-5 bg-light">
                                <p>Kindly login to contribute</p>
                                <Link to="/signin" className="btn btn-primary rounded-0" role="button"><i className="fas fa-lock pe-2"></i>Sign In</Link>
                            </div>:
                        <p></p>
                }
            </div>
            <div className="container-fluid d-flex flex-column bg-tertiary">
                <div className="container-md d-grid my-5">
                    {posts}
                </div>
            </div>
        </>
    )
}

export default Post;