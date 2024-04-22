//React Libraries/Modules Import
import React, { StrictMode, createContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate, ScrollRestoration, redirect } from "react-router-dom";

//3rd Party Libraries/Modules Import
//import {KindeProvider} from "@kinde-oss/kinde-auth-react";
import axios from 'axios';

//Styles Import
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-loading-skeleton/dist/skeleton.css"
import "./styles.css";

//Components Import
import Layout from "./pages/layout";
import Home from "./pages/home";
import Posts from "./pages/posts";
import Post from "./pages/post";
import About from "./pages/about";
import Contact from "./pages/contact";
import WritePost from "./pages/writepost";
import Community from "./pages/community";
import Search from "./pages/search";
import { Error } from "./components/errors";
import Administrator from "./pages/administrator";
import { Login, Register, Profile } from "./components/users";
import { useToken } from "./hooks/authentication";

import Dashboard from "./admin/dashboard";
import Users from "./admin/users";
import PostsBackend from "./admin/posts";
import Comments from "./admin/comments";
import { Postform } from "./components/forms";

export const userContext = createContext()

function Afriscope() {
  const {token, setToken, unsetToken} = useToken();

  async function auth({request}) {
		const url = new URL(request.url)
    const path = url.pathname.replace('/','')
		try{
        await axios.get(process.env.REACT_APP_SERVER_URL + `/user/auth?q=${path}`, {
        withCredentials: true
		  })
      return null
    }catch(error) {
      unsetToken()
      return redirect('/login')
    }
	}

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route exact path="/" element={
          <userContext.Provider value={{token: token, setToken: setToken, unsetToken: unsetToken }}>
            <Layout />
          </userContext.Provider>
          }>
          <Route index element={<Home />} />
          <Route path=":category" element={<Posts token={token}/>} />
          <Route path=":category/:slug" element={<Post token={token} unsetToken={unsetToken}/>} />
          <Route path="about-us" element={<About />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="community" element={<Community />} />
          <Route path="search" element={<Search />} />
          <Route path="login" element={<Login token={token} setToken={setToken} unsetToken={unsetToken}/>}/>
          <Route path="register" element={token ? <Navigate to={`/profile?q=${token?.name.toLowerCase()}`} replace={true}/> : <Register />} />
          <Route path="profile" element={<Profile token={token} setToken={setToken} unsetToken={unsetToken} />} />
          <Route path="write-post" element={<WritePost token={token}/>} />
          <Route path="*" element={<Error status="404" element="No Page"/>} />
        </Route>
        <Route exact path="/administrator" element={
          <userContext.Provider value={{token: token, setToken: setToken, unsetToken: unsetToken }}>
            <Administrator />
          </userContext.Provider>
        } loader={auth}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users token={token} />} />
          <Route path="posts" element={<PostsBackend />} />
          <Route path="comments" element={<Comments />} />
          <Route path="newpost" element={<Postform token={token} bgclass = "bg-light"/>} />
          <Route path="*" element={<Error status="404" element="No Page"/>} />
        </Route>
      </>
    )
  )

  return (
      <RouterProvider router={router} >
        <ScrollRestoration getKey={(location, matches) => {
            return location.pathname;
        }}/>
      </RouterProvider>
  )
};


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <StrictMode>
      <Afriscope />
  </StrictMode>
);