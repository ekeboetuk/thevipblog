import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import Skeleton from 'react-loading-skeleton';

import { useUser } from '../hooks/fetchers';
import { Error } from "./errors";
import Toast from "./toasts";

export function Register() {
    document.title = "Afriscope Blog - Register"

    const [toast, setToast] = useState({})
    const [state, setState] = useState({password:''})
    const [sending, setSending] = useState(false)
    const formelements = document.querySelectorAll("#names, #email, #password, [name='role'], #submit")

        const handleChange = (e) => {
          const value = e.target.value;
          setState({
            ...state,
            [e.target.name]: value
          });

          if(toast.state){
            setToast({state:false})
          }
        }

        const handleRegister = async(e) => {
            e.preventDefault()
            setSending(true)
            formelements.forEach(elem => elem.disabled = true);

           await axios.post(process.env.REACT_APP_SERVER_URL + `/user/register`, {
                    email: state.email,
                    password: state.password,
                    name: state.names,
                    role: state.role
                }
            )
            .then(() => {
                setToast({...toast, state:true, color: '#FFFFFF', status: 'success', msg:"Registeration successful! Login to continue"})
                setTimeout(()=>{
                    formelements.forEach(elem => elem.disabled = false);
                    setState({});
                    setSending(false)
                }, 10000)
            })
            .catch((error) => {
                if(error.request && !error.response) {
                    setToast({...toast, state:true, color: '#FFFFFF', status: 'warning', msg:"Network Error. Please Check Your Internet & Try Again!"})
                }else{
                    setToast({...toast, state:true, color: '#FFFFFF', status: 'error', msg:error.response.data})
                }
                setTimeout(()=>{
                    formelements.forEach(elem => elem.disabled = false);
                    setSending(false)
                }, 10000)
            })
        }

    return (
        <section className="container-sm mx-auto my-5 rounded-6">
            <div className="d-flex flex-column-reverse flex-md-row shadow">
                <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center bg-primary text-center text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                    <h3 className="text-bold">Hello!</h3>
                    <p>Do you have an account?</p>
                    <Link type="button" className="btn btn-outline-light py-3 px-5 rounded" to="/login" state={window.history.state} replace={true}>Login</Link>
                </div>
                <div id="formarea" className="col-12 col-md-8 bg-tertiary text-center text-brand px-5 pb-5 rounded-end display-relative">
                    <img src="/media/login-avatar-white.webp" width={80} className="bg-primary display-absolute top-0 end-50 translate-middle-y p-4 shadow rounded-circle" alt="login avatar" style={{backgroundColor: 'red'}}/>
                    <h4 className="fw-bold mb-5">Complete The Form To Continue</h4>
                    <form onSubmit={handleRegister} className="d-flex flex-column px-0 px-md-5 mx-0 mx-md-5">
                        <input
                            type="text"
                            id="names"
                            name="names"
                            value={state.names??""}
                            className="w-100 mb-4"
                            onChange ={handleChange}
                            autoComplete="name" 
                            placeholder="Name"/>
                        <input type="email" id="email" name="email" className="w-100 mb-4" value={state.email??""}
                                onChange ={handleChange} autoComplete="email" placeholder="E-mail"/>
                        <input type="password" id="password" name="password" className="w-100 mb-4" value={state.password??""}
                                onChange ={handleChange} autoComplete="current-password" placeholder="Password"/>
                        <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
                            <strong className="d-flex flex-row align-items-center">Register As <i className="fa-solid fa-caret-right"></i></strong>
                            <div className="d-flex flex-row">
                                <div className="d-flex pe-4">
                                    <input type="radio" id="editor" name="role" value="Editor" onChange ={handleChange} />
                                    <label htmlFor="editor" className="ps-2">Editor</label>
                                </div>
                                <div className="d-flex">
                                    <input type="radio" id="subscriber" name="role" value="Subscriber" onChange ={handleChange} defaultChecked/>
                                    <label htmlFor="subscriber" className="ps-2">Subscriber</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" id="submit" className="btn-primary rounded" disabled={!state.names || !state.email || state.password?.length < 5}>{sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:"Submit"}</button>
                        <p id="message" className="d-none mt-3 fw-bold" style={{height:"20px"}}>&nbsp;</p>
                    </form>
                </div>
            </div>
            {toast.state &&
                <Toast toast={toast} setToast={setToast} position="top-left">
                    {toast.msg}
                </Toast>
            }
        </section>
    )
}

export function Login( {token, setToken, unsetToken, setPortal} ) {
    document.title = "Afriscope Blog - Login"
    const state = useLocation().state
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        email: sessionStorage.getItem('email')||"",
        password:"",
        remember_me:sessionStorage.getItem('remember_me')==="true"
        })
    const [sending, setSending] = useState(false)
    const [toast, setToast] = useState({})

    useEffect(()=>{
        if(state?.resetToken){
            unsetToken()
            return navigate('/login',{state:{msg:state?.msg, path:state?.path, resetToken:false},replace:true})
        }
        if(state?.msg !== undefined) {
            const alert = document.createElement('div')
            alert.setAttribute('class', 'notification text-brand fw-bolder px-3 py-2 bg-tertiary rounded mb-5 z-2')
            alert.innerHTML = `<i class='fa-solid fa-circle-info'></i> ${state.msg}`
            const elem = document.getElementById('login')
            elem.insertBefore(alert, elem.children[0])
            setTimeout(()=>{
                const notification = document.getElementsByClassName('notification')[0]
                if(notification){
                    notification.remove()
                }
            }, 10000)
        }
        if(token && !state?.resetToken){
            navigate(state?.path==null?'/':`${state.path}${state.query?`?q=${state.query}`:''}`,{replace:true})
        }
    },[state, token, navigate, unsetToken])

    async function handleLogin(e) {
        e.preventDefault()
        setSending(true)
        await axios.post(process.env.REACT_APP_SERVER_URL + `/user/login`,{
            email: details.email,
            password: details.password,
            remember_me: details.remember_me
        },{
            withCredentials: true
            })
        .then((response) => {
            if(details.remember_me && details.email !== sessionStorage.getItem('email')) {
                sessionStorage.setItem("email", details.email)
                sessionStorage.setItem("remember_me", details.remember_me)
            }else if(!details.remember_me && details.email !== "") {
                sessionStorage.removeItem("email", details.email)
                sessionStorage.removeItem("remember_me", details.remember_me)
            }
            setToast({...toast, state:true, color: '#FFFFFF', status: 'success', msg:"Login Successful. Please wait, you'll redirected shortly!"})
            setTimeout(()=>{
                setPortal && setPortal(false)
                setToken(response.data);
            },2000)
        })
        .catch((error) => {
            setSending(false)
            if(error.request && !error.response) {
                setToast({...toast, state:true, color: '#FFFFFF', status: 'warning', msg:"Network Error. Please Try Again"})
            }else{
                setToast({...toast, state:true, color: '#FFFFFF', status: 'error', msg:error.response?.data})
            }
        })
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setDetails({
            ...details,
            [e.target.name]: value
        });

        if(toast.state){
           setToast({state:false})
        }
    }

    return(
        <section id="login" className="componentreveal container-sm mx-auto rounded-6 my-5">
            <div className="d-flex flex-column flex-md-row shadow">
                <div id="formarea" className="col-12 col-md-8 bg-tertiary text-center text-brand px-5 pb-5 rounded-end display-relative">
                    <img src="/media/login-avatar-white.webp" width={80} height={80} className="bg-primary display-absolute top-0 start-50 translate-middle-y p-4 shadow rounded-circle" alt="login avatar" style={{backgroundColor: 'red'}}/>
                    <h4 className="fw-bold pb-5">Please Sign In To Continue</h4>
                    <form onSubmit={handleLogin} className="d-flex flex-column px-0 px-md-5 mx-0 mx-md-5">
                        <input type="email" id="email" name="email" className="w-100 text-black-50 mb-4" onChange={handleChange} value={details.email??""} placeholder="E-mail" autoComplete="email" disabled={sending} />
                        <input type="password" id="password" name="password" className="w-100 text-black-50 mb-4" onChange={handleChange} value={details.password??""} autoComplete="current-password" placeholder="Password" disabled={sending} />
                        <div className="d-inline-flex align-items-center mb-4">
                            <input type="checkbox" id="remember_me" className="me-3" name="remember_me" onChange={() => setDetails({...details, remember_me: !details.remember_me})} checked={details.remember_me} disabled={sending} />
                            <label htmlFor="remember_me">Remember Me</label>
                        </div>
                        <button type="submit" className="btn-primary rounded"  disabled={!details.email || details.password.length < 5 || sending}>{sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:"Submit"}</button>
                        <p id="message" className="d-none mt-3 mb-5 fw-bold" style={{height:"20px"}}>&nbsp;</p>
                    </form>
                </div>
                <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center bg-primary text-center align-middle text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                    <h3 className="text-bold">Welcome Back!</h3>
                    <p>Don't have an account?</p>
                    <Link type="button" className="btn btn-outline-light py-3 rounded px-5" to="/register" state={window.history.state} replace={true}>Register</Link>
                </div>
            </div>
            {toast.state &&
                <Toast toast={toast} setToast={setToast} position="top-left">
                    {toast.msg}
                </Toast>
            }
        </section>
    )
}

export function Profile({ token, setToken }) {
    const {user, loading, error } = useUser(`/profile`)
    const [state, setState] = useState({avatar: user?.avatar})
    const [action, setAction] = useState("")
    const ref = useRef()
    const navigate = useNavigate()

    useEffect(()=> {
        ref.current = document.getElementById("update")
        document.title = `Afriscope Blog - Your Profile`
        if(user){
            window.history.replaceState({},"",`/profile?q=${user?.name.toLowerCase()}`)
        }
        if(!token) {
            return navigate('/login',{state:{msg:'Expired or invalid session token.', path:'/profile', resetToken:true}, replace:true})
        }
    }, [navigate, token, user])

    const previewFile = (e) => {
        console.log(e.target.name)
        const file = e.target.files[0];
        const reader = new FileReader();
        setAction("preview")

        if(file) {
           if(file.size > 1024 * 1000) {
            let msg = document.createElement("div")
            msg?.classList.add("text-danger", "fw-bolder", "mt-4")
            let text = document.createTextNode(`File Size Too Large (300kb Max)`)
            msg.appendChild(text)
            ref.current.insertAdjacentElement("afterend", msg)
            setTimeout(()=>{
                msg.removeChild(text)
            },20000)

           }else{
            reader.readAsDataURL(file);
           }
        }

        reader.addEventListener(
            "load",
            () => {
              setState({...state, avatar:reader.result})
            },
            false,
          );
      }

    const updateProfile = async(e) => {
        e.preventDefault()
        setAction("sending")

        await axios.post(process.env.REACT_APP_SERVER_URL+`/user/profile`, state, {withCredentials:true})
        .then((response)=>{
            let msg = document.createElement("div")
            msg?.classList.add("text-success", "fw-bolder", "mt-4")
            msg.appendChild(document.createTextNode("Successful"))
            ref.current.insertAdjacentElement("afterend", msg)
            setAction("updated")
            setToken(response.data)
            setState({...state, avatar: response.data.avatar})
            setTimeout(()=>{
                msg.remove()
            },5000)
        })
        .catch(()=>{
            let msg = document.createElement("div")
            msg.appendChild(document.createTextNode("Error Updating Data. Please Try Again!"))
            ref.current.insertAdjacentElement("afterend", msg)
            setAction("")
            setTimeout(()=>{
                msg.remove()
            },20000)
        })
    }
    window.scrollTo({top:0, left:0, behavior:'smooth'})
    if(loading){
        return (
            <section className="container-md d-flex flex-column mx-auto my-5 rounded-6 position-relative align-items-center">
                <div className="d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-50 translate-middle">
                    <Skeleton width="200px" height="200px" circle={true} className="border border-2 position-relative"/>
                </div>
                <div className="pt-5 pb-2 mt-5">
                    <Skeleton width="250px" height="15px" direction="rtl"/>
                </div>
            </section>
        )
    }
    if(error && (error.message==='Network Error' || error.response?.status >= 500)){
            return <Error status="500" message="Problem Loading Profile Data"/>
        }
    if(user){
        return (
            <>
                <section className="container-md d-flex flex-column mx-auto my-5 rounded-6 position-relative align-items-center">
                    <div className="d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-50 translate-middle">
                        <div id="profileimagearea"
                            className="border border-2 rounded-circle position-relative"
                            style={{width: "200px", height: "200px", backgroundImage:`url(${action===''||action==='edit'?user.avatar:state.avatar||'/media/photo-placeholder-male.jpeg'})`, backgroundPosition: "center", backgroundSize:"cover"}}
                            >
                            <div className={`${action==="edit"?"overlay opacity-50":"d-none"} rounded-circle bg-brand`}>
                                <input type="file" id="profile-picture" name="profile-picture" accept="image/jpeg, image/jpg, image/png, image/webp" onChange={previewFile} hidden />
                                &nbsp;
                            </div>
                            <label htmlFor="profile-picture" className={`${action==="edit"?"overlay position-absolute top-50 start-50 translate-middle":"d-none"}`}>
                                <i className="fa-solid fa-camera text-white fa-3x" role="button"></i>
                            </label>
                            {loading||action==="sending"?<div className="position-absolute top-50 start-50 translate-middle"><i className="fa-solid fa-arrows-rotate fa-spin fs-2"></i></div>:""}
                        </div>
                    </div>
                    <h4 className="pt-5 pb-2 mt-5">Welcome, <strong>{user?.name} </strong>{action!=="sending" && <i className="fa-solid fa-pen-to-square" role="button" onClick={(e)=>{action===""?setAction("edit"):setAction("")}}></i>}</h4>
                    {(action!==""&& action!=="updated")  &&
                        <button id="update" ref={ref} className={`btn btn-primary px-4 px-2 rounded-pill`}
                            onClick={updateProfile}
                            disabled={action==="sending"||action!=="preview"}>
                            {action==="sending"?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:<><i className="fa-solid fa-floppy-disk pe-2"></i>Save Profile</>}
                        </button>
                    }
                </section>
            </>
        )
    }
}