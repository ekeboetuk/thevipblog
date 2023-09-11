import { useState } from 'react';

import axios from 'axios';

function Meta({id, views, comments, likes}) {
  const [like, setLike] = useState(likes);
  const [liked, setLiked] = useState(localStorage.getItem(`like${id}`))

  const updateLikes = async() => {
    const alert = document.getElementById('alert');
    if(liked) {
      await axios.patch(`http://localhost:3001/post/likes`, {
        id: id,
        likes: like - 1
      })
      .then(()=>{
        localStorage.removeItem(`like${id}`)
        setLike(like - 1)
        setLiked(false)
        alert.classList.toggle("alert-success")
        alert.innerHTML = "<i class='fa-solid fa-circle-check pe-2'></i>Likes update successful."
        setTimeout(()=>{
            alert.innerHTML = ""
            alert.classList.toggle("alert-success")
        },5000)
      })
      .catch(()=>{
        alert.classList.add("alert-danger")
        alert.innerHTML = "<i class='fa-solid fa-triangle-exclamation pe-2'></i>Error updating likes"
        setTimeout(()=>{
            alert.innerHTML = ""
            alert.classList.remove("alert-danger")
        },5000)
      })
    }else{
      await axios.patch(`http://localhost:3001/post/likes`, {
        id: id,
        likes: like + 1
      })
      .then(()=>{
        localStorage.setItem(`like${id}`, true)
        setLike(like + 1)
        setLiked(true)
        alert.classList.toggle("alert-success")
        alert.innerHTML = "<i class='fa-solid fa-circle-check pe-2'></i>Likes update successful."
        setTimeout(()=>{
            alert.innerHTML = ""
            alert.classList.toggle("alert-success")
        },5000)
      })
      .catch(()=>{
        alert.classList.add("alert-danger")
        alert.innerHTML = "<i class='fa-solid fa-triangle-exclamation pe-2'></i>Error updating likes"
        setTimeout(()=>{
            alert.innerHTML = ""
            alert.classList.remove("alert-danger")
        },5000)
      })
    }
  }


  return (
    <div className="d-flex justify-content-between py-2">
      <span>{views} <i className="fa-solid fa-eye"></i></span>
      <span>{comments.filter(comment => comment.approved).length} Comments</span>
      <span type="button" className="d-flex align-items-center" onClick={updateLikes}>{like} <i className={`ps-1 fa-heart text-danger ${liked? "fa-solid": "fa-regular"}`}></i></span>
    </div>
    );
}

export default Meta