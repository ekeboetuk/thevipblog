import { useEffect, useState, memo } from 'react';
import axios from 'axios';import React from 'react';
import { useParams } from 'react-router-dom';

import { Postcard } from '../components/cards';

function Posts() {
    const [content, setContent] = useState();
    const params = useParams()

    useEffect(() => {
        axios
          .get(`http://localhost:3001/posts/${params.name}`)
          .then((response) => {
            const posts = response.data;
            posts.length > 0 ?
            setContent(
                <div className="container-md d-grid gap-4 py-5">
                    <div className="row row-cols-md-3">
                        {posts.map((post) => (
                            <div key={post._id} className="col g-4">
                                <Postcard
                                id={post._id}
                                image={post.image}
                                height="320px"
                                title={`${post.title.split(" ").splice(0, 6).join(" ")}..`}
                                body={`${post.body.split(" ").splice(0, 30).join(" ")}...`}
                                comments={post.comments}
                                category={post.meta.category}
                                meta={post.meta}
                                created={post.created}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                ):
                setContent(
                    <div className="container-md p-5 text-center">
                        <img src="/media/no_post.png" width="50px" className="py-3" alt="nopost" />
                        <h6 className="fw-bold">Currently unable to display posts under this category.</h6>
                        <h6>Either it's empty or someone forgot to connect something. Please check back later. Thank you!</h6>
                    </div>
                )
            })
          .catch(() => {
              setContent(
                <div className="container-md my-5 py-5 text-center">
                    <img src="/media/awsnapidle.webp" width="50px" className="py-3" alt="awsnap" />
                    <h6>Aw snap! Currently unable to fetch posts.</h6>
                </div>
              )
            });

          window.scrollTo(0, 0);
          setContent(
            <div className="container-md text-center my-5 py-5">
                <img src="/assets/spinner_block.gif" width="80px" alt="loading" />
            </div>
          )
        }, [params]);

    return (
        <>
            <div className="container-fluid mx-auto text-center fw-bold fs-4 py-5 bg-tertiary">
                <img src="/assets/icon.png" alt="afriscope icon" className="py-2" />
                {params.name.toUpperCase()}
            </div>
            {content}
        </>
    )
}

export default memo(Posts);