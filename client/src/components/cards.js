import axios from "axios";
import { Link } from "react-router-dom";

import moment from "moment";

import Meta from "./meta";

export const Postcard = ({
    id,
    slug,
    image,
    imgWidth = '100%',
    height,
    title,
    intro,
    comments,
    meta,
    category,
    showCategory,
    created,
    showMeta,
    showFeatured,
    showReadmore,
    showEngagement,
    font
}) => {
    const handleClick = () => {
        axios.patch(
            process.env.REACT_APP_SERVER_URL + `/post/views`,
            {
                id: id
            },
            {
                withCredentials: true
            }
        );
    };

    return (
        <>
            {image && (
                <div
                    className="postcard position-relative"
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "top center",
                        height: `${height}`,
                        width: `${imgWidth}`
                    }}
                >
                    {meta.featured && showFeatured && (
                        <span className="bg-danger m-2 px-3 py-1 text-white fw-bold position-absolute start-0 top-0 rounded-pill">
                            Featured
                        </span>
                    )}
                    <small className="text-white pe-4 py-2 fw-bold position-absolute end-0 bottom-0">
                        {meta.category?.toUpperCase()}
                    </small>
                </div>
            )}
            <div className="d-flex flex-column w-100 w-md-50 justify-content-between bg-light overflow-hidden rounded-bottom flex-fill">
                <div className="d-flex flex-column py-4 px-4 flex-fill justify-content-center">
                    <Link
                        to={`/${meta.category}/${slug}`}
                        className=""
                        onClick={handleClick} state={{id: id}}
                        preventScrollReset={true}
                    >
                        <h2 className="lh-1 fw-bolder text-body" style={{fontSize: font||"2rem"}}>
                            {title.toUpperCase()}
                        </h2>
                    </Link>
                    <div className="d-inline-flex align-items-center">
                        {showCategory && (
                            <small className="me-2 text-brand fw-bolder">
                                {meta.category.toUpperCase()}
                            </small>
                        )}
                        {showMeta && (
                            <div className="lh-sm">
                                <div className="d-flex flex-wrap text-brand">
                                    <div>
                                        <small className="fas fa-user me-1"></small>
                                        <small className="me-2 flex-fill">
                                            {(meta.author.isActive &&
                                                meta.author.name) ||
                                                "Administrator"}
                                        </small>
                                    </div>
                                    <div>
                                        <small className="fas fa-calendar-days me-1"></small>
                                        <small className="me-1 fst-italic">
                                            {moment(created).format(
                                                "YYYY-MM-DD h:mm"
                                            )}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                        {intro && (
                        <div className="mb-0">
                            <p className="intro text-justify lh-sm mt-3 mb-1">{intro}...</p>
                        </div>
                        )}
                        {showReadmore && (
                        <div className="mb-0">
                            <Link
                                to={`/${meta.category}/${slug}`}
                                className="text-brand fw-bold"
                                onClick={handleClick} state={{id: id}}
                                preventScrollReset={true}
                            >
                                Readmore
                                <i className="fas fa-arrow-circle-right ms-2"></i>
                            </Link>
                        </div>
                        )}
                </div>
                <div className="bg-tertiary px-3">
                    {showEngagement && (
                        <Meta
                            id={id}
                            slug={slug}
                            meta={meta}
                            comments={comments}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export const PostcardTransparent = ({
    id,
    slug,
    image,
    height,
    title,
    intro,
    comments,
    meta,
    category,
    created,
    showIntro,
    showMeta,
    showFeatured = true,
    showCategory
}) => {
    const updateViews = () => {
        axios
            .patch(
                process.env.REACT_APP_SERVER_URL + `/post/views`,
                {
                    id: id
                },
                {
                    withCredentials: true
                }
            )
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <>
            <div
                className="w-100 w-md-50 position-relative overflow-hidden"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: height,
                    height: "100%"
                }}
            >
                <div className="d-flex flex-row position-absolute start-0 top-0">
                    {meta.featured && showFeatured && (
                        <small className="bg-danger px-3 py-1 text-white fw-bold">
                            Featured
                        </small>
                    )}
                    {showCategory && (
                        <small className="bg-warning px-3 py-1 text-white fw-bold">
                            {meta.category.charAt(0).toUpperCase()+meta.category.slice(1)}
                        </small>
                    )}
                </div>
                <div className="postcontent d-flex flex-column w-100 w-md-50 justify-content-between text-white">
                      <div className="postintro d-flex flex-column bg-dark justify-content-between w-100">
                          <Link
                              to={`/${meta.category}/${slug}`}
                              onClick={updateViews} state={{id: id}}
                              preventScrollReset={true}
                          >
                              <h3 className="title fw-bolder text-white lh-sm">{title.toUpperCase()}</h3>
                              {showIntro && <p className="intro text-white fs-5 mb-0">{intro}</p>}
                          </Link>
                        </div>
                        {showMeta && <div className={`${showMeta && 'meta'} bg-dark position-absolute bottom-0 w-100 start-0 px-4`}>
                            <Meta
                                id={id}
                                slug={slug}
                                meta={meta}
                                comments={comments}
                            />
                        </div>}
                </div>
            </div>
        </>
    );
};

export const Usercard = ({ user, handleUserStatus }) => {
    return (
        <div className="bg-light rounded-5 shadow-sm">
            <img
                src={`${user.avatar||"/media/picture-placeholder.jpeg"}`}
                style={{ height: "150px", width: "100%", objectFit: "cover", objectPosition: "top center"}}
                alt="Avatar"
                className="square bg-white"
            />
            <div className="text-brand fw-bold pt-4">{user.name.toUpperCase()}</div>
            <div className="d-flex p-4 pt-0">
                <div className="d-flex flex-column align-items-end fw-normal pe-2 fw-bold">
                    <small className="">E-mail:</small>
                    <small className="">Role:</small>
                    <small className="">Joined:</small>
                    {user.email !== "admin@afriscope.ng" && (
                        <small className="">Status:</small>
                    )}
                </div>
                <div className="d-flex flex-column overflow-hidden align-items-start">
                    <small className="">{user.email}</small>
                    <small className="">{user.role}</small>
                    <small className="">
                        {moment(user.created).format("YYYY-MM-DD h:mm")}
                    </small>
                    {user.email !== "admin@afriscope.ng" && (
                        <small className="fw-normal">
                            <button
                                className="btn-primary px-2 text-white border-0 p-1"
                                onClick={() =>
                                    handleUserStatus(user._id, user.isActive)
                                }
                                disabled={user.email === "admin@afriscope.ng"}
                            >
                                {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Widgetcard = ({ title, children }) => {
    return (
        <div className="fw-normal rounded shadow-sm w-100 mb-5">
            {title && <h4 className="bg-primary text-white p-3 rounded-top fw-bold mb-0">
                {title} {title === "Look Here" && <i className="fa-solid fa-angles-down fa-bounce" style={{"--fa-animation-delay": "10s"}}></i>}
            </h4>}
            {children}
        </div>
    );
};
