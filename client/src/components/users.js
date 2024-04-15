import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useUsers } from '../hooks/fetchers'

import axios from "axios";


export function Register() {
    document.title = "Afriscope Blog - Sign Up"

    const [state, setState] = useState({password:''})
    const [sending, setSending] = useState(false)
    const message = document.getElementById("message")
    const formelements = document.querySelectorAll("#names, #email, #password, [name='role'], #submit")

        const handleChange = (e) => {
          const value = e.target.value;
          setState({
            ...state,
            [e.target.name]: value
          });

          if(message){
            message.classList.add('d-none')
          }
        }

        const handleRegister = async(e) => {
            e.preventDefault()
            setSending(true)
            message.classList.remove('text-success', 'text-danger')
            formelements.forEach(elem => elem.disabled = true);

           await axios.post(process.env.REACT_APP_SERVER_URL + `/user/register`, {
                    email: state.email,
                    password: state.password,
                    name: state.names,
                    type: state.role
                }
            )
            .then(() => {
                setTimeout(()=>{
                    message.classList.remove('d-none')
                    message.classList.add('text-success')
                    message.innerHTML = "Registeration successful! Login to continue";
                    formelements.forEach(elem => elem.disabled = false);
                    setState({});
                    setSending(false)
                }, 5000)
            })
            .catch((error) => {
                setTimeout(()=>{
                    message.classList.remove('d-none')
                    message.classList.add('text-danger')
                    message.innerHTML = `${error.response.data}`
                    formelements.forEach(elem => elem.disabled = false);
                    setSending(false)
                })
            })
        }

    return (
        <section className="container-sm mx-auto my-5 rounded-6">
            <div className="d-flex flex-column-reverse flex-md-row shadow">
                <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center bg-primary text-center text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                    <h3 className="text-bold">Hello!</h3>
                    <p>Do you have an account?</p>
                    <Link type="button" className="btn btn-outline-light py-3 px-5 rounded" to="/login">Login</Link>
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
                            placeholder="Name"/>
                        <input type="email" id="email" name="email" className="w-100 mb-4" value={state.email??""}
                                onChange ={handleChange} placeholder="E-mail"/>
                        <input type="password" id="password" name="password" className="w-100 mb-4" value={state.password??""}
                                onChange ={handleChange} placeholder="Password"/>
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
        </section>
    )
}

export function Login( {setToken, setPortal} ) {
    document.title = "Afriscope Blog - Sign In"
    const msg = useLocation().state
    const navigate = useNavigate();
    const [state, setState] = useState({
        email: sessionStorage.getItem('email')||"",
        password:"",
        remember_me:sessionStorage.getItem('remember_me')==="true"
        })
    const [sending, setSending] = useState(false)
    const message = document.getElementById("message")

    useEffect(()=>{
        if(msg !== null) {
            const alert = document.createElement('div')
            alert.setAttribute('class', 'text-brand fw-bolder px-3 py-2 bg-tertiary rounded mb-5 z-2')
            alert.innerHTML = `<i class='fa-solid fa-circle-info'></i> ${msg.message}`
            const elem = document.getElementById('login')
            elem.insertBefore(alert, elem.children[0])
        }
    },[msg])

    async function handleLogin(e) {
        e.preventDefault()
        setSending(true)

        await axios.post(process.env.REACT_APP_SERVER_URL + `/user/login`,{
            email: state.email,
            password: state.password,
            remember_me: state.remember_me
        },{
            withCredentials: true
            })
        .then((response) => {
            if(state.remember_me && state.email !== sessionStorage.getItem('email')) {
                sessionStorage.setItem("email", state.email)
                sessionStorage.setItem("remember_me", state.remember_me)
            }else if(!state.remember_me && state.email !== "") {
                sessionStorage.removeItem("email", state.email)
                sessionStorage.removeItem("remember_me", state.remember_me)
            }
            message.classList.remove('d-none')
            message.innerHTML = "Login successful";
            message.style.color = "green";
            navigate(-1)
            setTimeout(()=>{
                setPortal && setPortal(false)
                setToken(response.data);
            }, 10)
        })
        .catch((error) => {
            setSending(false)
            message.classList.remove('d-none')
            message.innerHTML = `${error.response?.data}`;
            message.style.color = "red";
        })
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            [e.target.name]: value
        });

        if(message){
            message.classList.add('d-none')
        }
    }

    return(
        <section id="login" className="componentreveal container-sm mx-auto rounded-6 my-5">
            <div className="d-flex flex-column flex-md-row shadow">
                <div id="formarea" className="col-12 col-md-8 bg-tertiary text-center text-brand px-5 pb-5 rounded-end display-relative">
                    <img src="/media/login-avatar-white.webp" width={80} height={80} className="bg-primary display-absolute top-0 start-50 translate-middle-y p-4 shadow rounded-circle" alt="login avatar" style={{backgroundColor: 'red'}}/>
                    <h4 className="fw-bold pb-5">Please Sign In To Continue</h4>
                    <form onSubmit={handleLogin} className="d-flex flex-column px-0 px-md-5 mx-0 mx-md-5">
                        <input type="email" id="email" name="email" className="w-100 text-black-50 mb-4" onChange={handleChange} value={state.email??""} placeholder="E-mail" autoComplete="on"/>
                        <input type="password" id="password" name="password" className="w-100 text-black-50 mb-4" onChange={handleChange} value={state.password??""} placeholder="Password"/>
                        <div className="d-inline-flex align-items-center mb-4">
                            <input type="checkbox" id="remember_me" className="me-3" name="remember_me" onChange={() => setState({...state, remember_me: !state.remember_me})} checked={state.remember_me} />
                            <label htmlFor="remember_me">Remember Me</label>
                        </div>
                        <button type="submit" className="btn-primary rounded"  disabled={!state.email || state.password.length < 5 || sending}>{sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:"Submit"}</button>
                        <p id="message" className="d-none mt-3 mb-5 fw-bold" style={{height:"20px"}}>&nbsp;</p>
                    </form>
                </div>
                <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center bg-primary text-center align-middle text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                    <h3 className="text-bold">Welcome Back!</h3>
                    <p>Don't have an account?</p>
                    <Link type="button" className="btn btn-outline-light py-3 rounded px-5" to="/register">Register</Link>
                </div>
            </div>
        </section>
    )
}

export function Profile({ token, setToken }) {
    let username = token.name.toLowerCase().replace(" ",".")
    const {users, isLoading} = useUsers(`/${token.id}`)
    const [state, setState] = useState({avatar: users?.avatar||token.avatar||'/media/photo-placeholder-male.jpeg'})
    const [action, setAction] = useState("")
    const ref = useRef()
    let navigate = useNavigate()

    useEffect(()=> {
        ref.current = document.getElementById("update")
        document.title = `Afriscope Blog - Your Profile`
        navigate(`?q=${username}`,{replace: true})
    }, [navigate, username])

    const previewFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        setAction("preview")

        reader.addEventListener(
          "load",
          () => {
            setState({...state, avatar:reader.result})
          },
          false,
        );
        if (file) {
           if(file.size > 1024 * 3000) {
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
      }

    const updateProfile = async(e) => {
        e.preventDefault()
        setAction("sending")

        await axios.post(process.env.REACT_APP_SERVER_URL+`/user/profile?id=${token.id}`, state)
        .then((response)=>{
            let msg = document.createElement("div")
            msg?.classList.add("text-success", "fw-bolder", "mt-4")
            msg.appendChild(document.createTextNode("Successful"))
            ref.current.insertAdjacentElement("afterend", msg)
            setAction("")
            setToken(response.data)
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

    return (
        <>
            <section className="container-md d-flex flex-column mx-auto my-5 rounded-6 position-relative align-items-center">
                <div className="d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-50 translate-middle">
                    <div id="profileimagearea"
                        className="border border-2 rounded-circle position-relative"
                        style={{width: "200px", height: "200px", backgroundImage:`url(${state.avatar})`, backgroundPosition: "center", backgroundSize:"cover"}}
                        >
                        <div className={`${action!=="" && action!=="sending"?"overlay opacity-50":"d-none"} rounded-circle bg-brand`}>
                            <input type="file" id="profile-picture" name="profile-picture" accept="image/jpeg, image/jpg, image/png, image/webp" onChange={previewFile} hidden />
                            &nbsp;
                        </div>
                        <label htmlFor="profile-picture" className={`${action!=="" && action!=="sending"?"overlay position-absolute top-50 start-50 translate-middle":"d-none"}`}>
                                <i className="fa-solid fa-camera text-white fa-3x" role="button"></i>
                        </label>
                        {isLoading||action==="sending"?<div className="position-absolute top-50 start-50 translate-middle"><i className="fa-solid fa-arrows-rotate fa-spin fs-2"></i></div>:""}
                    </div>
                </div>
                <h4 className="pt-5 pb-2 mt-5">Welcome, <strong>{token?.name} </strong>{action!=="sending" && <i className="fa-solid fa-pen-to-square" role="button" onClick={(e)=>{action===""?setAction("edit"):setAction("")}}></i>}</h4>
                {(action!=="")  &&
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