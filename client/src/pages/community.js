import { PostsCarousel } from "../components/carousels"

export default function Forum(){
    return(
        <>
            <section className="container-md text-center">
                    <p className="fw-bolder">COMING SOON</p>
                    <progress id="loading" className="border-0 w-25" value="10" max="100"> 10% </progress>
            </section>
            <section className="container-fluid" style={{backgroundColor: 'rgba(88, 88, 88, 0.8)'}}>
                <PostsCarousel count={4}/>
            </section>
        </>
    )
}