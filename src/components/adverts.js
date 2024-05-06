import { useEffect, useRef, memo } from 'react'

function Advert() {
    const timerRef = useRef()
    const advertRef = useRef()

    useEffect(()=>{
        const advert = advertRef.current
        timerRef.current = setInterval(()=>{
            advert.classList.toggle('invisible')
            advert.classList.toggle('opacity-0')
        }, 60000 )
        return ()=>clearTimeout(timerRef.current)
    },[])

    return (
      <div className="pt-5 pt-md-0" style={{padding: '0 20px'}}>
        <div id="advert" ref={advertRef} className="container-md mt-md-5 position-relative" style={{width: '100%', height: '156px', opacity: '1', animation: 'reveal 2s linear', transition: 'visibility 2s ease-in-out, opacity 2s linear'}}>
          <img src="/media/afriscope-banner.webp" width="100%" alt="Afriscope Banner" />
          <i className="fa-solid fa-circle-xmark fa-xl shadow-lg position-absolute translate-middle text-brand" style={{top: '20px',right:'0px'}} role="button" title="Click to hide banner" onClick={()=>{advertRef.current.classList.toggle('invisible'); advertRef.current.classList.toggle('opacity-0'); clearTimeout(timerRef.current)}}></i>
        </div>
      </div>
    )
}

export default memo(Advert)