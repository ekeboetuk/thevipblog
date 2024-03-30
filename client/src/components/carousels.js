import { useState } from "react"
import { usePosts } from "../hooks/fetchers"

import { Postcard } from "./cards"

export const Carousel = () => {
    return (
        <div id="carousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="/media/slider/slider_1.png" className="d-block w-100" alt="..."/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Life Styles</h5>
                        <p>Explore</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="/media/slider/slider_2.png" className="d-block w-100" alt="..." />
                    <div className="carousel-caption d-none d-md-block">
                        <h3>Fashion</h3>
                        <p>Explore</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="/media/slider/slider_3.png" className="d-block w-100" alt="..." />
                    <div className="carousel-caption d-none d-md-block">
                        <h3>Sports & Fitness</h3>
                        <p>Explore</p>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}

export const PostsCarousel = ({title, count = 3, limit = 4, scrollDirection = "ltr", scrollCount = 1, autoPlay, delay = 8, showMeta, showEngagement}) => {
    const {posts, isLoading} = usePosts(`/?sort=-_id&limit=${limit}`)
    const [scrollindex, setScrollindex] = useState(0)
    let postWidth, containerWidth, carousel, carouselWidth, overflowCount, autoscroll

    if(posts?.length > 0 && document.getElementsByClassName("postcard")[0]){
        postWidth = document.getElementsByClassName("postcard")[0].getBoundingClientRect().width
        containerWidth = postWidth * limit
        carousel = document.getElementById("carousel")
        carouselWidth = carousel.getBoundingClientRect().width
        overflowCount = Math.round((containerWidth - carouselWidth)/postWidth)
    }

    if(autoPlay && overflowCount > 0){
        if(posts?.length > 0 && document.getElementById("carousel")){
            autoscroll = setTimeout(()=>{
                if(scrollindex === overflowCount){
                    carousel.style.transform = `translateX(0px)`
                    return setScrollindex(0)
                }else{
                    carousel.style.transform = `translateX(-${postWidth*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
                    return setScrollindex(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
                }
            }, delay*1000)
        }
      }

    const handleClick = (navigation) => {
        clearTimeout(autoscroll)
        if(navigation === "left" ){
        	if(scrollindex <= 0){
		        return
	        }else{
	          carousel.style.transform = `translateX(-${postWidth*(scrollindex-(scrollindex>scrollCount?scrollCount:scrollindex||1))}px)`
	          setScrollindex(scrollindex-(scrollindex>scrollCount?scrollCount:scrollindex||1))
	        }
        }else{
	        if(scrollindex === overflowCount){
		        return
	        }else{
	          carousel.style.transform = `translateX(-${postWidth*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
	          setScrollindex(scrollindex +(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
	        }
        }
    }

    return(
        <div className="container-md overflow-hidden position-relative">
            {title && <h4 className="text-center text-uppercase text-white mb-5">{title}</h4>}
            <div className="position-relative overflow-hidden">
                {posts?.length > 0 && overflowCount > 0 &&
                    <>
                        {scrollindex > 0 && <div className="position-absolute top-50 start-0 translate-middle-y" role="button" onClick={()=>handleClick("left")}  style={{zIndex: "1"}}>
                            <i className="fa-solid fa-circle-arrow-left fa-2xl text-white"></i>
                        </div>}
                        {scrollindex < overflowCount && <div className="position-absolute top-50 end-0 translate-middle-y" role="button" onClick={()=>handleClick("right")} style={{zIndex: "1"}}>
                            <i className="fa-solid fa-circle-arrow-right fa-2xl text-white"></i>
                        </div>}
                    </>
                }
                {isLoading?
                    <div className="text-white text-center">
                        <i className="fa-solid fa-arrow-rotate-right fa-spin"></i>
                        &nbsp; Loading
                    </div>:
                    <div id="carousel" className={`row row-cols-1 row-cols-md-${count||3} flex-nowrap`}>
                        {posts && posts.slice(0, 20).map((post) => (
                            <div key={post._id} className={`postcard notch-upward col g-4 gx-md-${count||3} gy-md-0 d-flex flex-column`}>
                                <Postcard
                                    id={post._id}
                                    slug={post.slug}
                                    image={post.image}
                                    title={post.title}
                                    comments={post.comments}
                                    meta={post.meta}
                                    created={post.created}
                                    height="180px"
                                    showMeta={showMeta}
                                    showEngagement={showEngagement}
                                    font="1.5rem"
                                />
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}