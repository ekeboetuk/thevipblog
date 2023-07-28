import { useState } from 'react';

import axios from 'axios';

function Meta({id, views, comments, likes}) {
  const [like, setLike] = useState(likes);
  const [liked, setLiked] = useState(localStorage.getItem(`like${id}`))

  const updateLikes = async() => {
    if(liked) {
      localStorage.removeItem(`like${id}`)
      await axios.patch(`http://localhost:3001/post/likes`, {
        id: id,
        likes: like - 1
      })
      .then(()=>{
        setLike(like - 1)
        setLiked(false)
      })
    }else{
      localStorage.setItem(`like${id}`, true)
      await axios.patch(`http://localhost:3001/post/likes`, {
        id: id,
        likes: like + 1
      })
      .then(()=>{
        setLike(like + 1)
        setLiked(true)
      })
    }
  }


  return (
    <div className="d-flex justify-content-between py-2">
      <span>{views} <i className="fa-solid fa-eye"></i></span>
      <span>{comments.filter(comment => comment.approved).length} Comments</span>
      <span type="button" onClick={updateLikes}>{like} <i className={liked? "fa fa-heart text-danger": "fa-regular fa-heart text-danger"}></i></span>
    </div>
    );
}

export default Meta