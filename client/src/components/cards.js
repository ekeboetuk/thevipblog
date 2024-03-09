import axios from 'axios';
import { Link } from 'react-router-dom';

import moment from 'moment';

import Meta from './meta';


export const Postcard = ({id, slug, image, height, title, intro, comments, meta, category, created, showReadmore, showMeta, showEngagement }) => {

  const handleClick = () => {
    axios
    .patch(process.env.REACT_APP_SERVER_URL + `/post/views`, {
      id: id
    }, {
      withCredentials: true
    })
  }

  return (
    <>
      <div className="w-100 w-md-50 position-relative" style={{backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: `${height}`}} >
        {meta.featured && <span className="bg-danger m-2 px-3 py-1 text-white fw-bold position-absolute start-0 top-0 rounded-pill">Featured</span>}
        <small className="text-white pe-4 py-2 fw-bold position-absolute end-0 bottom-0">{category?.toUpperCase()}</small>
      </div>
      <div className="d-flex flex-column w-100 w-md-50 justify-content-between bg-light overflow-hidden rounded-bottom flex-fill">
        <div className="d-flex flex-column py-4 px-4 justify-content-between position-relative">
            <Link to={`/${slug.toLowerCase()}`} className="stretched-link" onClick={handleClick}>
              <h3 className="lh-2 title text-black fw-bold text-body">{title.toUpperCase()}</h3>
            </Link>
            <div className="d-inline-flex align-items-center mb-3">
                {showMeta && 
                  <div className="lh-sm">
                    <div className="d-flex flex-wrap text-brand">
                      <div>
                        <small className="fas fa-user me-1"></small>
                        <small className="me-2 flex-fill">{(meta.author.isActive && meta.author.name)||"Administrator"}</small>
                      </div>
                      <div>
                        <small className="fas fa-calendar-days me-1"></small>
                        <small className="me-1 fst-italic">{moment(created).format("YYYY-MM-DD h:mm")}</small>
                      </div>
                    </div>
                </div>
                }
            </div>
            <div className="mb-0">
                <p className="text-justify lh-sm mb-1">{intro}</p>
                {showReadmore &&
                  <Link to={`/post/${slug.toLowerCase()}`} className="text-brand fw-bold stretched-link" onClick={handleClick}>Readmore
                    <i className="fas fa-arrow-circle-right ms-2"></i>
                  </Link>
                }
            </div>
        </div>
        <div className="bg-tertiary px-3">
            {showEngagement && <Meta id={id} views={meta.views} comments={comments} likes={meta.likes} />}
        </div>
      </div>
    </>
  );
}

export const PostcardTransparent = ({id, slug, image, height, title, intro, comments, meta, category, created }) => {

  const updateViews = () => {
    axios
    .patch(process.env.REACT_APP_SERVER_URL + `/post/views`, {
      id: id
    }, {
      withCredentials: true
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <>
      <div className="w-100 w-md-50 position-relative overflow-hidden" style={{backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: height}}>
        {meta.featured && <small className="bg-danger m-2 px-3 py-1 text-white fw-bold position-absolute start-0 top-0 rounded-pill">Featured</small>}
        <div className="postintro d-flex flex-column w-100 w-md-50 justify-content-between bg-dark text-white">
          <div className="d-flex flex-column py-3 px-4 justify-content-between">
              <Link className="title fw-bolder text-white lh-sm pb-3" to={`/${slug}`} onClick={updateViews}><h2>{title.toUpperCase()}</h2></Link>
              <p>{intro}</p>
          </div>
          <div className="bg-dark px-3">
              <Meta id={id} views={meta.views} comments={comments} likes={meta.likes} />
          </div>
        </div>
      </div>
    </>
  );
}

export const Usercard = ( {user, handleUserStatus} ) => {
  return (
      <div className="bg-light p-4 rounded-5">
          <img src="/assets/icon.png" style={{height: "100px", width: "100px"}} alt="Avatar" className="square bg-white rounded-circle p-3 me-3 mb-3" />
          <div className="text-brand fw-bold">{user.name.toUpperCase()}</div>
          <div className="d-flex">
              <div className="d-flex flex-column align-items-end fw-normal pe-2">
                  <small className="">E-mail:</small>
                  <small className="">Type:</small>
                  <small className="">Joined:</small>
                  {user.email !== "admin@afriscope.ng" && <small className="">Status:</small>}
              </div>
              <div className="d-flex flex-column overflow-hidden align-items-start">
                  <small className="">{user.email}</small>
                  <small className="">{user.type}</small>
                  <small className="">{moment(user.created).format("YYYY-MM-DD h:mm")}</small>
                 {user.email !== "admin@afriscope.ng" && <small className="fw-normal"><button className="btn-primary px-2 rounded-pill text-white border-0" onClick={()=>handleUserStatus(user._id, user.isActive)} disabled={user.email==="admin@afriscope.ng"}>{user.isActive?"Deactivate":"Activate"}</button></small>}
              </div>
          </div>
      </div>
    )

}

export const Widgetcard = ({ title, children }) => {
  return (
      <div className="fw-normal rounded mb-4 shadow-sm w-100">
        <h4 className="bg-primary text-white p-4 rounded-top fw-bold mb-0">{title}</h4>
          {children}
      </div>
  )
}