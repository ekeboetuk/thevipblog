import { useEffect, useRef, memo } from 'react'

function Advert() {
    const timerRef = useRef()
    const timer =  useRef(Math.round(Math.random().toFixed(1)*10000) + 10000)

    useEffect(()=>{
        const advert = document.getElementById('advert')
        timerRef.current = setInterval(()=>{
            if(advert.style.visibility === "hidden"){
                advert.style.animation = 'reveal 4s ease-in-out'
                advert.style.visibility = 'visible'
                timer.current = Math.round(Math.random().toFixed(1)*10000) + 10000
            }else{
                advert.style.animation = 'reveal 4s ease-in-out'
                advert.style.visibility = 'hidden'
            }
        }, timer.current )
    },[])

    return (
      <div className="pt-5 pt-md-0" style={{padding: '0 20px'}}>
        <div id="advert" className="container-md mt-md-5 position-relative" style={{width: '100%', height: '156px', visibility: 'hidden'}}>
          <img src="/media/afriscope-banner.webp" width="100%" alt="Afriscope Banner" />
          <i className="fa-solid fa-rectangle-xmark fa-lg position-absolute top-0 start-100 translate-middle text-brand" role="button" onClick={()=>{document.getElementById('advert').style.visibility = 'hidden'; clearInterval(timerRef.current)}}></i>
        </div>
      </div>
    )
}

export default memo(Advert)