import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Carousel from '../components/carousel';
import { Postcard } from '../components/cards';


function Home() {
    const [content, setContent] = useState();

    useEffect(() => {
      axios
        .get('http://localhost:3001/posts')
        .then((response) => {
          response.data.length === 0 ?
          setContent(
            <div className="text-center">
               <h6>No featured post.</h6>
            </div>) :
            setContent(
            response.data.toReversed().map((post) => (post.meta.featured &&
                <div key={post._id} className="d-flex flex-column flex-md-row mb-5">
                    <Postcard
                    id={post._id}
                    image={post.image}
                    title={post.title}
                    body={`${post.body.split(" ").splice(0, 70).join(" ")}...`}
                    comments={post.comments}
                    category={post.meta.category}
                    meta={post.meta}
                    created={post.created}
                    height="400px"
                    />
                </div>
            ))
          )
        })
        .catch(() => {
            setContent(
                <div className="text-center">
                    <img src="/media/awsnapidle.webp" width="50px" className="py-3" alt="awsnap" />
                    <h6>Aw snap! Currently unable to fetch featured posts.</h6>
                </div>
            )
        });

        setContent(
            <div className="container-md text-center">
                <img src="/assets/spinner_block.gif" className="my-5 py-5" width="60px" alt="loading" />
            </div>
        );
    }, []);

    return (
        <>
            <Carousel />
            <div className="container-md py-5">
                <h2 className="text-center pb-4 fs-5 fw-bold">FEATURED POSTS</h2>
                {content}
            </div>
        </>

    )
}

export default Home