import { useState } from 'react';

import axios from 'axios';

function Meta({id, views, comments, likes}) {
  const [like, setLike] = useState(likes);
  const [liked, setLiked] = useState(localStorage.getItem(`like${id}`))

  const alert = document.getElementById('alert');

  const updateLikes = async() => {
    try{
      if(liked) {
        await axios.patch(process.env.REACT_APP_SERVER_URL + '/post/likes', {
          id: id,
          likes: like - 1
        })
        .then(()=>{
          localStorage.removeItem(`like${id}`)
          setLike(like - 1)
          setLiked(false)
          alert.classList.toggle('alert-success')
          alert.innerHTML = '<i class="fa-solid fa-circle-check pe-2"></i>Likes updated successfully.'
        })
      } else {
        await axios.patch(process.env.REACT_APP_SERVER_URL + '/post/likes', {
          id: id,
          likes: like + 1
        })
        .then(()=>{
          localStorage.setItem(`like${id}`, true)
          setLike(like + 1)
          setLiked(true)
          alert.classList.toggle('alert-success')
          alert.innerHTML = '<i class="fa-solid fa-circle-check pe-2"></i>Likes updated successfully.'
        })
      }
    } catch(err) {
      alert.classList.add('alert-danger')
      alert.innerHTML = '<i class="fa-solid fa-triangle-exclamation pe-2"></i>Error updating likes'
    }
    setTimeout(()=>{
        if(alert.classList.contains('alert-danger')){
            alert.classList.remove('alert-danger')
        }else{
            alert.classList.remove('alert-success')
        }
        alert.innerHTML = ''
    }, 8000)
  }


  return (
    <div className="d-flex justify-content-between py-2">
      <span title="Views">{views} <i className="fa-solid fa-eye"></i></span>
      <span>{comments.filter(comment => comment.approved).length} Comments</span>
      <span type="button" className="d-flex align-items-center" title="Likes" onClick={updateLikes}>{like} <i className={`ps-1 fa-heart text-danger ${liked? "fa-solid": "fa-regular"}`}></i></span>
    </div>
    );
}

export default Meta