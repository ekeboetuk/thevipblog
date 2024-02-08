import axios from 'axios';
import { Link } from 'react-router-dom';

import moment from 'moment';

import Meta from './meta';


export const Postcard = ({id, slug, image, height, title, intro, comments, meta, category, created }) => {

  const handleClick = () => {
    axios
    .patch(process.env.REACT_APP_SERVER_URL + `/post/views`, {
      id: id
    }, {
      withCredentials: true
    })
  }

  const imageBuffer = btoa(new Uint8Array(image.data.data).reduce(function (data, byte) {
    return data + String.fromCharCode(byte);
  }, ''));

  return (
    <>
      <div className="w-100 w-md-50 position-relative" style={{backgroundImage: `url(data:image/jpeg;base64,${imageBuffer})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: height}}>
        {meta.featured && <span className="bg-warning px-2 py-1 text-white fs-8 fw-normal position-absolute start-0 top-0">Featured</span>}
      </div>
      <div className="d-flex flex-column w-100 w-md-50 justify-content-between bg-light overflow-hidden rounded-bottom">
        <div className="d-flex flex-column py-3 px-4 justify-content-between position-relative">
            <div className="d-inline-flex align-items-center mb-2">
                <img src="/assets/icon.png" style={{height: "30px", width: "30px"}} alt="afriscope icon" className="square bg-tertiary rounded-circle p-1 me-3" />
                <div className="lh-sm">
                    <div className="text-brand fw-bold fs-6">{category?.toUpperCase()}</div>
                    <div className="d-flex flex-wrap">
                      <div>
                        <small className="fas fa-user fs-8 me-1"></small>
                        <small className="me-2 fs-8 flex-fill">{(meta.author.isActive && meta.author.name)||"Administrator"}</small>
                      </div>
                      <div>
                        <small className="fas fa-calendar-days fs-8 me-1"></small>
                        <small className="me-1 fs-8 fst-italic">{moment(created).format("YYYY-MM-DD h:mm")}</small>
                      </div>
                    </div>
                </div>
            </div>
            <Link className="title text-black fs-6 fw-bold text-body" to={`/post/${slug}`}>{title}</Link>
            <div className="mb-0">
                <p className="text-justify lh-sm mb-1">{intro}</p>
                <Link to={`/post/${slug.toLowerCase()}`} className="text-brand fw-bold stretched-link" onClick={handleClick}>Readmore
                  <i className="fas fa-arrow-circle-right ms-2"></i>
                </Link>
            </div>
        </div>
        <div className="bg-tertiary px-3">
            <Meta id={id} views={meta.views} comments={comments} likes={meta.likes} />
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

  const imageBuffer = btoa(new Uint8Array(image.data.data).reduce(function (data, byte) {
    return data + String.fromCharCode(byte);
  }, ''));

  return (
    <>
      <div className="w-100 w-md-50 position-relative" style={{backgroundImage: `url(data:image/jpeg;base64,${imageBuffer})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: height}}>
        {meta.featured && <span className="bg-warning px-2 py-1 text-white fs-8 fw-normal position-absolute start-0 top-0">Featured</span>}
        <div className="d-flex flex-column w-100 w-md-50 justify-content-between bg-dark text-white overflow-hidden position-absolute bottom-0 opacity-75">
          <div className="d-flex flex-column py-3 px-4 justify-content-between position-relative">
              <Link className="title fs-5 fw-normal text-white lh-sm" to={`/post/${slug}`} onClick={updateViews}>{title}</Link>
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
          <div className="text-brand fw-bold fs-6">{user.name.toUpperCase()}</div>
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
      <div className="fw-normal  rounded mb-4 shadow-sm">
        <h6 className="bg-primary text-white p-2 rounded-top fw-bold mb-0">{title}</h6>
        {children}
      </div>
  )
}