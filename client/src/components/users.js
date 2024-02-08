import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";


export function Signup() {
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
            message.innerHTML = ""
          }
        }

        const handleSignup = async(e) => {
            e.preventDefault()
            setSending(true)
            message.classList.remove('text-success', 'text-danger')
            message.innerHTML = "Please wait..."
            formelements.forEach(elem => elem.disabled = true);

           await axios.post(process.env.REACT_APP_SERVER_URL + `/user/newuser`, {
                    email: state.email,
                    password: state.password,
                    name: state.names
                }
            )
            .then(() => {
                setTimeout(()=>{
                    message.classList.add('text-success')
                    message.innerHTML = "Signup successful! Sign in to continue";
                    formelements.forEach(elem => elem.disabled = false);
                    setState({});
                    setSending(false)
                }, 5000)
            })
            .catch((error) => {
                setTimeout(()=>{
                    message.classList.add('text-danger')
                    message.innerHTML = `${error.response.data}`
                    formelements.forEach(elem => elem.disabled = false);
                    setSending(false)
                })
            })
        }

    return (
        <div className="container-sm mx-auto my-5 rounded-6">
        <div className="d-flex flex-column-reverse flex-md-row">
            <div className="d-flex flex-column justify-content-center align-items-center bg-primary text-center align-middle text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                <h3 className="text-bold">Hello!</h3>
                <p>Do you have an account?</p>
                <Link type="button" className="btn btn-outline-light px-5 rounded-8" to="/signin">Sign In</Link>
            </div>
            <div className="flex-grow-1 bg-tertiary align-items-center text-center text-brand p-5 rounded-end d-flex flex-column justify-content-center align-items-center" id="form-area">
                <h4 className="fw-bold">Create Account</h4>
                <div>
                    <a className="text-light" href="https://f.me/afriscope">
                        <i className="fa-brands fa-facebook-f fa-lg text-primary me-5"></i>
                    </a>
                    <a className="text-light" href="https://t.me/afriscope">
                        <i className="fa-brands fa-google fa-lg text-danger me-5"></i>
                    </a>
                    <a className="text-light" href="https://i.me/afriscope">
                        <i className="fa-brands fa-apple bg-dark text-dark fa-lg"></i>
                    </a>
                </div>
                <small className="mb-3">Or register with your email</small>
                <form onSubmit={handleSignup} className="d-flex flex-column justify-content-center align-items-center px-5">
                    <div>
                        <i className="fas fa-user text-brand position-absolute top-50 start-0 translate-middle ps-5 lh-1"></i>
                        <input
                            type="text"
                            id="names"
                            name="names"
                            value={state.names??""}
                            className="flex-fill border border-1 border-primary rounded-pill ps-5 pe-3 pt-1"
                            onChange ={handleChange}
                            placeholder="Name"/>
                    </div>
                    <div>
                        <i className="fas fa-at text-brand position-absolute top-50 start-0 translate-middle ps-5 lh-1"></i>
                        <input type="email" id="email" name="email" className="flex-fill border border-1 border-primary rounded-pill ps-5 pe-3 pt-1" value={state.email??""}
                            onChange ={handleChange} placeholder="E-mail"/>
                    </div>
                    <div>
                        <i className="fas fa-lock text-brand position-absolute top-50 start-0 translate-middle ps-5 lh-1"></i>
                        <input type="password" id="password" name="password" className="flex-fill border border-1 border-primary rounded-pill ps-5 pe-3 pt-1" value={state.password??""}
                            onChange ={handleChange} placeholder="Password"/>
                    </div>
                    <button type="submit" id="submit" className="btn btn-primary px-5 rounded-8" disabled={!state.names || !state.email || state.password.length < 5}>{sending?<i className="fa-solid fa-circle-notch fa-spin"></i>:"Sign Up"}</button>
                    <p id="message" className="mt-3 fw-bold" style={{height:"20px"}}>&nbsp;</p>
                </form>
            </div>
        </div>
        </div>
    )
}

export function Signin( {setToken} ) {
    document.title = "Afriscope Blog - Sign In"

    const [state, setState] = useState({
        email: sessionStorage.getItem('email')||"",
        password:"",
        remember_me:sessionStorage.getItem('remember_me')==="true"
        })
    const message = document.getElementById("message")

    const navigate = useNavigate();

        async function handleLogin(e) {
            e.preventDefault()

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
                message.innerHTML = "Login successful";
                message.style.color = "green";
                navigate(-1)
                setTimeout(()=>{
                    setToken(response.data);
                }, 10)
            })
            .catch((error) => {
                message.innerHTML = `${error.response.data}`;
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
              message.innerHTML = ""
            }
          }

    return(
        <div className="container-sm mx-auto my-5 rounded-6">
        <div className="d-flex flex-column flex-md-row">
            <div className="flex-grow-1 bg-tertiary text-center text-brand p-5 rounded-end">
                <h4 className="fw-bold">Sign in</h4>
                <div>
                    <a className="text-light" href="https://f.me/afriscope">
                        <i className="fab fa-facebook-f fa-lg text-primary pe-5"></i>
                    </a>
                    <a className="text-light" href="https://t.me/afriscope">
                        <i className="fab fa-google fa-lg text-info pe-5"></i>
                    </a>
                    <a className="text-light" href="https://i.me/afriscope">
                        <i className="fab fa-apple text-dark fa-lg"></i>
                    </a>
                </div>
                <small>Or sign in with your email</small>
                <form onSubmit={handleLogin} className="d-flex flex-column align-items-center mt-3">
                    <div>
                        <i className="fas fa-at text-brand position-absolute top-50 start-0 translate-middle ps-5 lh-1"></i>
                        <input type="email" id="email" name="email" onChange={handleChange} value={state.email??""} className="flex-fill border border-1 border-primary rounded-pill text-black-50 ps-5 pe-3 pt-1" placeholder="E-mail" autoComplete="on"/>
                    </div>
                    <div>
                        <i className="fas fa-lock  text-brand position-absolute top-50 start-0 translate-middle ps-5 lh-1"></i>
                        <input type="password" id="password" name="password" onChange={handleChange} value={state.password??""} className="flex-fill border border-1 border-primary rounded-pill text-black-50 ps-5 pe-3 pt-1" placeholder="Password"/>
                    </div>
                    <div className="d-flex flex-row">
                        <input type="checkbox" id="remember_me" className="me-3" name="remember_me" onChange={() => setState({...state, remember_me: !state.remember_me})} checked={state.remember_me} />
                        <label htmlFor="remember_me">Remember Me</label>
                    </div>
                    <button type="submit" className="btn btn-primary px-5 rounded-8"  disabled={!state.email || state.password.length < 5}>Sign In</button>
                    <p id="message" className="mt-3 fw-bold" style={{height:"20px"}}>&nbsp;</p>
                </form>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center bg-primary text-center align-middle text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                <h3 className="text-bold">Welcome Back!</h3>
                <p>Don"t have an account?</p>
                <Link type="button" className="btn btn-outline-light px-5 rounded-8" to="/signup">Sign Up</Link>
            </div>
        </div>
        </div>
    )
}

export function Profile({ token }) {
    return (
        <div className="container-sm mx-auto my-5 rounded-6">
            <h4>Welcome, <strong>{token?.name}!</strong></h4>
        </div>
    )
}