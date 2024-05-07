import { useState, useRef, useEffect } from "react";
import { usePosts } from "../hooks/fetchers";
import Skeleton from "react-loading-skeleton";

import { Postcard } from "./cards"

export const PostsCarousel = ({title = "Latest Post", sort, count = 3, limit = 4, scrollCount = 1, autoplay, delay = 8, continous = true, height = 180, query, postId, showMeta, showEngagement}) => {
    const {posts, loading, error} = usePosts(`/${title.toLowerCase().split(' ')[0]}/?sort=${sort||'-_id'}&limit=${limit}&query=${query}&postId=${postId}`)
    const [scrollindex, setScrollindex] = useState(0)
    const [play, setPlay] = useState(autoplay)
    const scrollRef = useRef()
    let postWidth, containerWidth, carousel, carouselWidth, overflowCount

    if(posts?.length > 0 && document.getElementsByClassName("notch-upward")[0]){
        postWidth = document.getElementsByClassName("notch-upward")[0].getBoundingClientRect().width
        containerWidth = postWidth * posts?.length
        carousel = document.getElementById("carousel")
        carouselWidth = carousel.getBoundingClientRect().width
        overflowCount = Math.round((containerWidth - carouselWidth)/postWidth)
    }

    useEffect(()=>{
        if(!loading && play && overflowCount > 0){
        if(posts?.length > 0 && document.getElementById("carousel")){
            scrollRef.current = setTimeout(()=>{
                if(scrollindex === overflowCount){
                    carousel.style.transform = `translateX(-${0}px)`
                    setScrollindex(0)
                    return setPlay(continous)
                }else{
                    carousel.style.transform = `translateX(-${postWidth*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
                    return setScrollindex(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
                }
            }, delay*1000)
        }
      }
    },[loading, carousel?.style, continous, delay, overflowCount, play, postWidth, posts?.length, scrollCount, scrollindex])

    const handleClick = (navigation) => {
        clearTimeout(scrollRef.current)
        setPlay(false)
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

        setTimeout(()=>{
            setPlay(continous)
        }, 10000)
    }

    if(posts){
        return(
            <div className="container-md overflow-hidden">
                {title && <h4 className="text-center text-uppercase text-white mb-5">{title}</h4>}
                <div className="position-relative">
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
                    {error||posts?.length === 0 ? <p id="info" className="text-center text-white">Nothing To See Here Today!</p>:
                        <div id="carousel" className={`row row-cols-1 row-cols-md-${count} flex-nowrap`}>
                        {loading ?
                            <>
                                <div className="d-flex flex-column pe-4">
                                    <Skeleton className="w-100" height="180px"/>
                                    <div className="p-4" style={{backgroundColor: "#FBFBFB"}}>
                                        <Skeleton count={2} />
                                    </div>
                                </div>
                                <div className="d-flex flex-column pe-4">
                                    <Skeleton className="w-100" height="180px"/>
                                    <div className="p-4" style={{backgroundColor: "#FBFBFB"}}>
                                        <Skeleton count={2} />
                                    </div>
                                </div>
                                <div className="d-flex flex-column pe-4">
                                    <Skeleton className="w-100" height="180px"/>
                                    <div className="p-4" style={{backgroundColor: "#FBFBFB"}}>
                                        <Skeleton count={2} />
                                    </div>
                                </div>
                            </>:
                            posts && posts.slice(0, limit).map((post) => (
                                <div key={post._id} className={`notch-upward col g-4 gx-md-${count} gy-md-0 d-flex flex-column`}>
                                    <Postcard
                                        id={post._id}
                                        slug={post.slug}
                                        image={post.image}
                                        title={post.title}
                                        comments={post.comments}
                                        meta={post.meta}
                                        created={post.created}
                                        height={`${height}px`}
                                        showMeta={showMeta}
                                        showEngagement={showEngagement}
                                        font="0.9em"
                                    />
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export const CarouselWrapper = ({children, autoplay=false, continous=false, delay=30, scrollCount=1, limit}) => {
    const [scrollindex, setScrollindex] = useState(0)
    const [play, setPlay] = useState(autoplay)
    const scrollRef = useRef()
    let postWidth, containerWidth, carousel, carouselWidth, overflowCount

    if(children && document.getElementsByClassName("notch-upward")[0]){
        postWidth = document.getElementsByClassName("notch-upward")[0].getBoundingClientRect().width
        containerWidth = postWidth * limit
        carousel = document.getElementById("carousel")
        carouselWidth = carousel.getBoundingClientRect().width
        overflowCount = Math.round((containerWidth - carouselWidth)/postWidth)
    }

    useEffect(()=>{
        if(play && overflowCount > 0){
        if(limit > 0 && document.getElementById("carousel")){
            scrollRef.current = setTimeout(()=>{
                if(scrollindex === overflowCount){
                    carousel.style.transform = `translateX(-${0}px)`
                    setScrollindex(0)
                    return setPlay(continous)
                }else{
                    carousel.style.transform = `translateX(-${postWidth*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
                    return setScrollindex(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
                }
            }, delay*1000)
        }
      }
    },[carousel?.style, continous, delay, limit, overflowCount, play, postWidth, scrollCount, scrollindex])

    const handleClick = (navigation) => {
        clearTimeout(scrollRef.current)
        setPlay(false)
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

        setTimeout(()=>{
            setPlay(continous)
        }, 10000)
    }
    return (
        <div className="container-md overflow-hidden">
            <div className="position-relative">
                {children}
                <>
                    {scrollindex > 0 &&
                        <div onClick={()=>handleClick("left")} role="button">
                            <div className="d-flex justify-content-center align-items-center bg-dark opacity-75 position-absolute top-0 start-0" style={{height: '100%', width: '35px'}}>
                                <i className="fa-solid fa-circle-arrow-left fa-xl text-white"></i>
                            </div>
                        </div>
                    }
                    {scrollindex < overflowCount &&
                        <div onClick={()=>handleClick("right")} role="button">
                            <div className="d-flex justify-content-center align-items-center bg-dark opacity-75 position-absolute top-0 end-0" style={{height: '100%', width: '35px'}}>
                                <i className="fa-solid fa-circle-arrow-right fa-xl text-white"></i>
                            </div>
                        </div>
                    }
                </>
            </div>
        </div>
    )
}