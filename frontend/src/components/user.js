import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';


export const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

        async function handleSignup(e) {
            e.preventDefault()

           await axios.post('http://localhost:3001/users/newuser', {
                    email: email,
                    password: password,
                    name: name
                }
            )
            .then(() => {
                const message= document.getElementById('form-area')
                message.style.fontSize = "28px"
                message.innerHTML = name + " signup successful";
            })
            .catch(() => {
                const message = document.getElementById('message')
                message.innerHTML = "User already exist! Sign in?";
                message.style.fontWeight = "bold"
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
                        <i className="fab fa-facebook-f fa-lg text-primary me-5"></i>
                    </a>
                    <a className="text-light" href="https://t.me/afriscope">
                        <i className="fab fa-google fa-lg text-info me-5"></i>
                    </a>
                    <a className="text-light" href="https://i.me/afriscope">
                        <i className="fab fa-apple text-dark fa-lg"></i>
                    </a>
                </div>
                <small>Or register with your email</small>
                <form onSubmit={handleSignup} className="d-flex flex-column align-items-center">
                    <div className="d-inline-flex my-3">
                        <div className="input-group-addon border border-primary border-end-0">
                            <i className="fas fa-user fa-lg text-brand m-3"></i>
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control ps-0 border border-primary border-start-0 rounded-0"
                            value={name}
                            onChange ={(e)=>setName(e.target.value)}
                            placeholder="Name"/>
                    </div>
                    <div className="d-inline-flex mb-3">
                        <div className="input-group-addon border border-primary border-end-0">
                            <i className="fas fa-envelope fa-lg text-brand m-3"></i>
                        </div>
                        <input type="email" id="email" name="name" className="form-control ps-0 border border-primary border-start-0 rounded-0" value={email}
                            onChange ={(e)=>setEmail(e.target.value)} placeholder="E-mail"/>
                    </div>
                    <div className="d-inline-flex mb-3">
                        <div className="input-group-addon border border-primary border-end-0">
                            <i className="fas fa-lock fa-lg text-brand m-3"></i>
                        </div>
                        <input type="password" id="password" name="password" className="form-control ps-0 border border-primary border-start-0 rounded-0" value={password}
                            onChange ={(e)=>setPassword(e.target.value)} placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary px-5 rounded-8" disabled={!name || !email || password.length < 5}>Sign Up</button>
                    <p id="message" className="text-danger mt-3"></p>
                </form>
            </div>
        </div>
        </div>
    )
}

export const Signin = ( {setToken} ) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

        async function handleLogin(e) {
            e.preventDefault()

           await axios.post('http://localhost:3001/login', {
                    email: email,
                    password: password
                }
            )
            .then((response) => {
                document.getElementById('message').innerHTML = "Login successful";
                document.getElementById("message").style.color = "green";
                setToken(response.data);
                setTimeout(()=>{
                  navigate(-1)
                }, 10)
            })
            .catch((error) => {
                document.getElementById('message').innerHTML = error.response.data;
                document.getElementById("message").style.color = "red";
                document.getElementById("message").style.fontWeight = "bold";
            })
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
                <form onSubmit={handleLogin} className="d-flex flex-column align-items-center">
                    <div className="d-inline-flex mb-3">
                        <div className="input-group-addon border border-primary border-end-0">
                            <i className="fas fa-envelope fa-lg text-brand m-3"></i>
                        </div>
                        <input type="email" id="email" name="email" onChange={(e)=>setEmail(e.target.value)} value={email} className="form-control ps-0 border border-primary border-start-0 rounded-0" placeholder="E-mail"/>
                    </div>
                    <div className="d-inline-flex mb-3">
                        <div className="input-group-addon border border-primary border-end-0">
                            <i className="fas fa-lock fa-lg text-brand m-3"></i>
                        </div>
                        <input type="password" id="password" name="password" onChange={(e)=>setPassword(e.target.value)} value={password} className="form-control ps-0 border border-primary border-start-0 rounded-0" placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary px-5 rounded-8"  disabled={!email || password.length < 5}>Sign In</button>
                    <p id="message" className="pt-3">&nbsp;</p>
                </form>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center bg-primary text-center align-middle text-white p-5 rounded-start" style={{backgroundImage: "url('/assets/icon-faded.png')", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition: "center"}}>
                <h3 className="text-bold">Welcome Back!</h3>
                <p>Don't have an account?</p>
                <Link type="button" className="btn btn-outline-light px-5 rounded-8" to="/signup">Sign Up</Link>
            </div>
        </div>
        </div>
    )
}

export const Profile = () => {
    return (
        <div className="container-sm mx-auto my-5 rounded-6">
            <h4>User Profile</h4>
        </div>
    )
}

export function useToken() {
    const getToken = () => {
      const token = localStorage.getItem('token');
      return token;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
      localStorage.setItem('token', JSON.stringify(userToken));
      setToken(userToken);
    };
    
    const removeToken = () => {
      localStorage.removeItem('token')
      setToken()
    }

    return {
      setToken: saveToken,
      token,
      unsetToken: removeToken
    }
  }