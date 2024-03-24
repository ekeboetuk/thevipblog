import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Meta({id, slug, comments, meta}) {
  const [like, setLike] = useState(meta?.likes);
  const [liked, setLiked] = useState(localStorage.getItem(`like${id}`))
  const navigate = useNavigate()

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
    <div className="d-inline-flex gap-4 py-2">
      <span title="Views"><i className="fa-solid fa-book-open-reader"></i> {meta?.views} </span>
      <span title="Comments" role="button" onClick={()=>{navigate(`/${meta?.category}/${slug}#comments`)}}><i className="fa-solid fa-comments"></i> {comments.filter(comment => comment.approved).length}</span>
      <span title="Likes" role="button" onClick={updateLikes}><i className={`pe-1 fa-solid fa-thumbs-up ${liked? "text-danger": ""}`}></i>{like}</span>
    </div>
    );
}

export default Meta