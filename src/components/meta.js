import { useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
const Toast = lazy(()=>import('./toasts'))

function Meta({id, slug, comments, meta}) {
  const [like, setLike] = useState(meta?.likes);
  const [liked, setLiked] = useState(localStorage.getItem(`like${id}`))
  const [toast, setToast] = useState({})
  const navigate = useNavigate()

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
          setToast({...toast, state:true, color: '#FFFFFF', status: 'success', msg:'Likes update successful'})
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
          setToast({...toast, state:true, color: '#FFFFFF', status: 'success', msg:'Likes update successful'})
        })
      }
    } catch(err) {
      setToast({...toast, state:true, color: '#FFFFFF', status: 'danger', msg:'Likes update successful'})
    }
  }


  return (
    <>
      <div className="d-inline-flex gap-4 py-2">
        <span title="Views"><i className="fa-solid fa-book-open-reader"></i> {meta?.views} </span>
        <span title="Comments" role="button" onClick={()=>{navigate(`/${meta?.category}/${slug}#comments`)}}><i className="fa-solid fa-comments"></i> {comments.filter(comment => comment.approved).length}</span>
        <span title="Likes" role="button" onClick={updateLikes}><i className={`pe-1 fa-solid fa-thumbs-up ${liked? "text-danger": ""}`}></i>{like}</span>
      </div>
      {toast.state &&
          <Toast toast={toast} setToast={setToast} position="top-left">
              {toast.msg}
          </Toast>
      }
    </>
    );
}

export default Meta