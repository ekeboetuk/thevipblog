function Carousel() {
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

export default Carousel;