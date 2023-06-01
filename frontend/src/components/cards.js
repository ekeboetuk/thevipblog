import axios from 'axios';
import { Link } from 'react-router-dom';

import moment from 'moment';

import Meta from './meta';


export function Postcard({id, image, height, title, body, comments, meta, category, created }) {
  function updateViews() {
    axios
    .patch(`http://localhost:3001/post/updateViews`, {
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
      <div className="w-100 w-md-50 rounded-top" style={{backgroundImage: `url(data:image/jpeg;base64,${imageBuffer})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: height}}>
      </div>
      <div className="d-flex flex-column w-100 w-md-50 justify-content-between bg-light overflow-hidden rounded-bottom">
        <div className="d-flex flex-column py-3 px-4 justify-content-between">
            <div className="d-inline-flex align-items-center mb-3">
              {category &&
                <>
                  <img src="/assets/icon.png" style={{height: "50px", width: "50px"}} alt="afriscope icon" className="square bg-tertiary rounded-circle p-1 me-3" />
                  <div>
                      <div className="text-brand fw-bold fs-5">{meta.category.toUpperCase()}</div>
                      <div className="d-flex flex-wrap">
                        <div>
                          <small className="fas fa-edit fs-8 me-1"></small>
                          <small className="me-2 fs-8 flex-fill">{meta.author.name}</small>
                        </div>
                        <div>
                          <small className="fas fa-clock fs-8 me-1"></small>
                          <small className="me-1 fs-8 fst-italic">{moment(created).format("YYYY-MM-DD h:mm")}</small>
                        </div>
                      </div>
                  </div>
                </>
              }
            </div>
            <Link className="text-black fs-6 fw-bold text-body lh-sm" to={`/post/${id}`} onClick={updateViews}>{title}</Link>
            <div className="mb-0">
              {<p dangerouslySetInnerHTML={{ __html:body}} className="fs-6 lh-sm" />}
                <Link to={`/post/${id}`} className="text-brand fw-bold">Readmore
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