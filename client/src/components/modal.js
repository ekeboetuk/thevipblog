export default function Modal({children, onClick}) {
  return (
    <div id="pagemodal">
        <div className="position-absolute top-0 start-0 opacity-75 w-100 h-100 bg-dark" onClick={onClick}>
        </div>
        <div className="position-fixed top-50 start-50 translate-middle w-100">
            {children}
        </div>
        <i className="fa-solid fa-circle-xmark fa-lg text-white" role="button" style={{position: 'fixed', top: '100px', right: '20px'}} onClick={onClick}></i>
    </div>
  )
}
