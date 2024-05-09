import { useState, useEffect, useRef } from 'react';

export default function Toast({children, position, toast, setToast, timeout=5}) {
  const [parent, setParent] = useState(toast.state)
  const [child, setChild] = useState(false)
  const manualClose = useRef()
  let style

  useEffect(()=>{
    if(parent && !child){
      setChild(true)
    }else if(!parent && child) {
        manualClose.current = setTimeout(()=>{
          setToast({...toast, state:false})
        }, 1000)
    }
    return ()=>clearTimeout(manualClose.current)
  },[parent, child, timeout, setToast, toast])

  const autoClose = setTimeout(()=>{
    setParent(!parent)
  },timeout*1000)

  switch(position) {
    case("top-left"): {
      style = {
        top: '70px',
        left: 0,
        color: toast.color,
        maxWidth: '80%'
      };
      break;
    }
    case("top-right"): {
      style = {
        top: '70px',
        right: 0,
        color: toast.color,
        maxWidth: '80%'
      };
      break;
    }
    case("bottom-left"): {
      style = {
        bottom: 0,
        left: 0,
        color: toast.color,
        maxWidth: '80%'
      };
      break;
    }
    default: {
      style = {
        bottom: 0,
        right: 0,
        color: toast.color,
        maxWidth: '80%'
      }
    }
  }

  return (
      <div id="toast" className={`position-fixed m-4 fs-5 ${parent?`${position==='top-left'||position==='bottom-left'?'slideinleft':'slideinright'}`:`${position==='top-right'||position==='bottom-right'?'slideoutright':'slideoutleft'}`} bg-${(toast.status==='success'&&'success')||(toast.status==='warning'&&'warning')||(toast.status==='error'&&'danger')}`} style={style}>
        <div className="position-relative py-3 ps-3 pe-5 fw-bolder d-inline-flex align-items-center">
          <i className={`pe-2 fa-solid fa-${(toast.status==='success'&&'circle-info')||(toast.status==='warning'&&'circle-exclamation')||(toast.status==='error'&&'triangle-exclamation')}`}></i>
          {children}
          <i className="fa-solid fa-circle-xmark position-absolute top-0 end-0 m-2" role="button" onClick={()=>{setParent(!parent); clearTimeout(autoClose.current)}} style={{fontSize: '1em', color:'#FFFFFF'}}></i>
        </div>
        <div className={`bg-brand progress ${!parent?'d-none':''}`} style={{height:'4px'}}></div>
      </div>
  )
}
