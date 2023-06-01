import { useState, useEffect, memo } from 'react';

import axios from 'axios';

function Meta({id, views, comments, likes}) {
  const [like, setLike] = useState(likes);
  const [liked, setLiked] = useState(localStorage.getItem(`like${id}`))

  function updateLikes() {
    if(liked) { 
      localStorage.removeItem(`like${id}`)
      setLike(like => like - 1)
      setLiked(false)
    }else{
      localStorage.setItem(`like${id}`, true)
      setLike(like => like + 1)
      setLiked(true)
    }
  }


    useEffect(()=>{
      axios
        .patch(`http://localhost:3001/post/updatelikes`, {
        id: id,
        likes: like
      })
      .catch((error) => {
        console.log(error)
      })
    }, [id,like])

    return (
      <div className="d-flex justify-content-between py-2">
        <span>{views} Views</span>
        <span>{comments.filter(comment => comment.approved).length} Comments</span>
        <span type="button" onClick={updateLikes}>{like} <i className={liked? "fa fa-heart text-danger": "fa-regular fa-heart text-danger"}></i></span>
      </div>
    );
  }

  export default memo(Meta)