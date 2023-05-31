import React from 'react';
import { MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit';
import Slider1 from '../images/slider-1.png';
import Slider2 from '../images/slider-2.png';
import Slider3 from '../images/slider-3.png';

function Slider() {
  return (
    <MDBCarousel showIndicators showControls fade>
      <MDBCarouselItem
        className='w-100 before:d-block slider'
        itemId={1}
        src={Slider1}
        alt='...'>
        <h3>Fashion</h3>
        <p>Explore</p>
      </MDBCarouselItem>
      <MDBCarouselItem
        className='w-100 d-block slider'
        itemId={2}
        src={Slider2}
        alt='...'>
        <h3>Sports & Fitness</h3>
        <p>Explore</p>
      </MDBCarouselItem>
      <MDBCarouselItem
        className='w-100 d-block slider'
        itemId={3}
        src={Slider3}
        alt='...'>
        <h3>Life Syles</h3>
        <p>Explore</p>
      </MDBCarouselItem>
    </MDBCarousel>
  )
}

export default Slider;