import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { userContext } from '../index';
import { useUsers } from '../hooks/fetchers'

import axios from "axios";


export function Register() {
    document.title = "Afriscope Blog - Sign Up"

    const [state, setState] = useState({password:''})
    const [sending, setSending] = useState(false)
    const message = document.getElementById("message")
    const formelements = document.querySelectorAll("#names, #email, #password, #submit")

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
                    name: state.names
                }
            )
            .then(() => {
                setTimeout(()=>{
                    message.classList.remove('d-none')
                    message.classList.add('text-success')
                    message.innerHTML = "Signup successful! Sign in to continue";
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
                    <Link type="button" className="btn btn-outline-light py-3 px-5" to="/login">Login</Link>
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
                        <button type="submit" id="submit" className="btn-primary" disabled={!state.names || !state.email || state.password.length < 5}>{sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:"Submit"}</button>
                        <p id="message" className="d-none mt-3 fw-bold" style={{height:"20px"}}>&nbsp;</p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export function Login( {setToken} ) {
    document.title = "Afriscope Blog - Sign In"

    const [state, setState] = useState({
        email: sessionStorage.getItem('email')||"",
        password:"",
        remember_me:sessionStorage.getItem('remember_me')==="true"
        })
    const [sending, setSending] = useState(false)
    const message = document.getElementById("message")

    const navigate = useNavigate();

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
        <section className="container-sm mx-auto rounded-6 mt-5">
            <div className="d-flex flex-column flex-md-row shadow">
                <div id="formarea" className="col-12 col-md-8 bg-tertiary text-center text-brand px-5 pb-5 rounded-end display-relative">
                    <img src="/media/login-avatar-white.webp" width={80} className="bg-primary display-absolute top-0 start-50 translate-middle-y p-4 shadow rounded-circle" alt="login avatar" style={{backgroundColor: 'red'}}/>
                    <h4 className="fw-bold pb-5">Please Sign In To Continue</h4>
                    <form onSubmit={handleLogin} className="d-flex flex-column px-0 px-md-5 mx-0 mx-md-5">
                        <input type="email" id="email" name="email" className="w-100 text-black-50 mb-4" onChange={handleChange} value={state.email??""} placeholder="E-mail" autoComplete="on"/>
                        <input type="password" id="password" name="password" className="w-100 text-black-50 mb-4" onChange={handleChange} value={state.password??""} placeholder="Password"/>
                        <div className="d-inline-flex align-items-center mb-4">
                            <input type="checkbox" id="remember_me" className="me-3" name="remember_me" onChange={() => setState({...state, remember_me: !state.remember_me})} checked={state.remember_me} />
                            <label htmlFor="remember_me">Remember Me</label>
                        </div>
                        <button type="submit" className="btn-primary"  disabled={!state.email || state.password.length < 5 || sending}>{sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:"Submit"}</button>
                        <p id="message" className="d-none mt-3 mb-5 fw-bold" style={{height:"20px"}}>&nbsp;</p>
                    </form>
                </div>
                <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center bg-primary text-center align-middle text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                    <h3 className="text-bold">Welcome Back!</h3>
                    <p>Don't have an account?</p>
                    <Link type="button" className="btn btn-outline-light py-3 px-5" to="/register">Register</Link>
                </div>
            </div>
        </section>
    )
}

export function UserMenu( ) {
	const [usermenu, showUsermenu] = useState(false)
	const {token, unsetToken} = useContext(userContext)

    function handleClick () {
        showUsermenu(!usermenu)
        document.addEventListener('click', e => {
            if (e.target.nodeName !== 'BUTTON' && e.target.nodeName !== 'IMG' && e.target.nodeName !== 'I') showUsermenu(false);
          });
    }

	function handleLogout() {
		document.cookie = "SessionToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
		unsetToken();
	}

	return (
		<>
			{token ?
				<>
					<div id="user" className="d-flex justify-content-end" onClick={handleClick}>
						<button className={`border border-primary bg-primary rounded-pill d-flex flex-fill text-white justify-content-between align-items-center fw-bold px-1`} style={{fontSize: '70%', fontWeight: '800'}} data-mdb-ripple-duration="2s">
                            <img src={`${token.avatar || "/assets/icon-white.webp"}`} role="button" className="me-2 rounded-circle" height={30} width={30} alt="icon" style={{objectFit: "cover"}}/>
							<i role="button" className="fas fa-circle-chevron-down fa-lg lh-1"></i>
						</button>
						{usermenu &&
							<div id="usermenu" className="d-flex flex-column position-absolute top-100 end-0 bg-tertiary actionmenu shadow-sm">
								<Link to={`/profile?q=${token.name.split(' ').join('.').toLowerCase()}`} className="menuitem link-dark"><li className="fas fa-address-card me-2"></li>My Profile</Link>
								{token?.type !== 'Subscriber' &&
									<>
										<Link className="menuitem link-dark" to="/write-post"><i className="fa-solid fa-keyboard me-2"></i>Write Post</Link>
									</>
								}
								{token?.isAdmin && <Link to="/administrator/posts" className="menuitem link-dark"><li className="fa-solid fa-toolbox me-2"></li>Administrator</Link>}
								<Link className="menuitem link-dark" onClick={handleLogout}><li className="fa-solid fa-lock-open me-2"></li>Sign Out</Link>
							</div>}
					</div>
				</> :
				<Link className="text-white border border-primary rounded-pill px-3 py-2" to="/login" role="button">
					<i className="fas fa-right-to-bracket me-2"></i>
					Login
				</Link>
			}
		</>
	);
}

export function Profile({ token }) {
    let username = token.name.toLowerCase().replace(" ","."), picture
    const {users, isLoading} = useUsers(`s/${token.id}`)
    const [state, setState] = useState({picture: ""})
    const [upload, setUpload] = useState(false)
    const [edit, setEdit] = useState(false)
    const [sending, setSending] = useState(false)
    let navigate = useNavigate()

    useEffect(()=> {
        document.title = `Afriscope Blog - Your Profile`
        navigate(`?q=${username}`,{replace: true})
    }, [navigate, username])

    if(users&&users.image) {
        picture = users.image
    }else{
        picture = '/media/photo-placeholder-male.jpeg'
    }

    const previewFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.addEventListener(
          "load",
          () => {
            setUpload(true)
            setState({...state, picture: reader.result});
          },
          false,
        );
        if (file) {
          reader.readAsDataURL(file);
        }
      }

    const updateProfile = async(e) => {
        e.preventDefault()
        setSending(true)
        const elem = document.getElementById("update")
        const msg = document.createElement("div")
        msg.classList.add("text-success")

        await axios.post(process.env.REACT_APP_SERVER_URL+`/user/profile?id=${token.id}`, state)
        .then((response)=>{
            msg.appendChild(document.createTextNode("Successful"))
            elem.insertAdjacentElement("afterend", msg)
            setState({...state, picture:response.data.image})
            setUpload(false)
            setSending(false)
            setTimeout(()=>{
                setEdit(false)
                msg.remove()
            },5000)
        })
        .catch(()=>{
            msg.appendChild(document.createTextNode("Error Updating Data. Please Try Again!"))
            elem.insertAdjacentElement("afterend", msg)
            setState({...state, picture: users.image})
            setSending(false)
            setTimeout(()=>{
                msg.remove()
            },5000)
        })
    }

    return (
        <>
            <section className="container-md d-flex flex-column mx-auto my-5 rounded-6 position-relative align-items-center">
                <div className="d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-50 translate-middle">
                    <div id="profileimagearea"
                        className="border border-2 rounded-circle position-relative"
                        style={{width: "200px", height: "200px", backgroundImage:`url(${state.picture||picture})`, backgroundPosition: "center", backgroundSize:"cover"}}
                        >
                        <div className={`${edit&&!sending?"overlay":"d-none"} rounded-circle bg-brand`}>
                            <input type="file" id="profile-picture" name="profile-picture" accept="image/jpeg, image/jpg, image/png, image/webp" onChange={previewFile} hidden />
                            <label htmlFor="profile-picture" className="d-flex flex-column justify-content-center align-items-center">
                                <i className="fa-solid fa-camera text-white" role="button" style={{fontSize:"5rem"}}></i>
                            </label>
                            &nbsp;
                        </div>
                        {isLoading||sending?<div className="position-absolute top-50 start-50 translate-middle"><i className="fa-solid fa-arrows-rotate fa-spin fs-2"></i></div>:""}
                    </div>
                </div>
                <h4 className="pt-5 pb-2 mt-5">Welcome, <strong>{token?.name} </strong>{!sending && <i className="fa-solid fa-pen-to-square" role="button" onClick={()=>setEdit(!edit)}></i>}</h4>
                {edit &&
                    <button id="update" className={`btn btn-primary px-4 px-2 rounded-pill`}
                        onClick={updateProfile}
                        disabled={sending||!upload}>
                        {sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:<><i className="fa-solid fa-floppy-disk pe-2"></i>Save Profile</>}
                    </button>
                }
            </section>
        </>
    )
}