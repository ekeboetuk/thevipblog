import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { userContext } from '../index';

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

           await axios.post(process.env.REACT_APP_SERVER_URL + `/user/newuser`, {
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
                    <Link type="button" className="btn btn-outline-light py-3 px-5" to="/signin">Sign In</Link>
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
                        <button type="submit" id="submit" className="btn-primary" disabled={!state.names || !state.email || state.password.length < 5}>{sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:"Sign Up"}</button>
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
                        <button type="submit" className="btn-primary"  disabled={!state.email || state.password.length < 5 || sending}>{sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:"Sign In"}</button>
                        <p id="message" className="d-none mt-3 mb-5 fw-bold" style={{height:"20px"}}>&nbsp;</p>
                    </form>
                </div>
                <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center bg-primary text-center align-middle text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                    <h3 className="text-bold">Welcome Back!</h3>
                    <p>Don't have an account?</p>
                    <Link type="button" className="btn btn-outline-light py-3 px-5" to="/signup">Sign Up</Link>
                </div>
            </div>
        </section>
    )
}

export function UserMenu( ) {
	const [usermenu, showUsermenu] = useState(false)
	const {token, unsetToken} = useContext(userContext)
	const navigate = useNavigate()

    function handleClick () {
        showUsermenu(!usermenu)
        document.addEventListener('click', e => {
            if (e.target.nodeName !== 'BUTTON') showUsermenu(false);
          });
    }

	function handleLogout() {
		document.cookie = "SessionToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
        navigate(0)
		unsetToken();
	}

	return (
		<>
			{token ?
				<>
					<div className="position-relative d-flex justify-content-end" onClick={handleClick}>
						<button className={`btn border border-primary rounded-pill d-flex flex-fill text-white justify-content-between align-items-center fw-bold px-3`} style={{fontSize: '70%', fontWeight: '800'}}>
							<div>
                                <img src="/assets/icon-white.webp" className="pe-2 rounded-circle" height={20} alt="icon"/>
                                Hi, {token?.name.split(" ")[0]}
                            </div>
							<i className="fas fa-circle-chevron-down fa-lg lh-1"></i>
						</button>
						{usermenu &&
							<div id="usermenu" className="d-flex flex-column position-absolute top-100 start-0 w-100 bg-tertiary actionmenu">
								<Link to={`/profile?q=${token.name.split(' ').join('.').toLowerCase()}`} className="menuitem link-dark"><li className="fas fa-user me-2"></li>My Profile</Link>
								{token?.type !== 'Subscriber' &&
									<>
										<Link className="menuitem link-dark" to="/newpost"><i className="bx bx-notepad me-2"></i>Write Post</Link>
									</>
								}
								{token?.isAdmin && <Link to="/administrator/posts" className="menuitem link-dark"><li className="fas fa-gear me-2"></li>Administrator</Link>}
								<Link className="menuitem link-dark" onClick={handleLogout}><li className="fas fa-unlock me-2"></li>Sign Out</Link>
							</div>}
					</div>
				</> :
				<Link className="btn text-white border border-primary rounded-pill" to="/login" role="button">
					<i className="fas fa-right-to-bracket me-2"></i>
					Sign In
				</Link>
			}
		</>
	);
}

export function Profile({ token }) {
    let navigate = useNavigate()
    let username = token.name.toLowerCase().replace(" ",".")

    useEffect(()=> {
        document.title = `Afriscope Blog - Your Profile`
        navigate(`?q=${username}`,{replace: true})
    }, [navigate, username])

    return (
        <>
            <section className="container-md mx-auto my-5 rounded-6">
                <h4>Welcome, <strong>{token?.name}!</strong></h4>
            </section>
        </>
    )
}