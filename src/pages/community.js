import { useEffect } from 'react'
import { PostsCarousel } from "../components/carousels"

export default function Forum(){
    useEffect(()=>{
        document.title = "Afriscope Blog - The Community"
        window.scrollTo({top:0,left:0,behavior:'smooth'})
    },[])

    return(
        <>
            <section className="container-md text-center">
                    <p className="fw-bolder">COMING SOON...</p>
                    <progress id="loading" className="border-0 w-25" value="10" max="100"> 10% </progress>
            </section>
            <section className="container-fluid" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                <PostsCarousel count={4}/>
            </section>
        </>
    )
}