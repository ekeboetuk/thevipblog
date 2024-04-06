import React, { StrictMode, createContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate, ScrollRestoration } from "react-router-dom";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-loading-skeleton/dist/skeleton.css"
import "./styles.css";

import axios from 'axios'


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
  const {tokenRef, setToken, unsetToken} = useToken();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route exact path="/" element={
          <userContext.Provider value={{token: tokenRef.current, setToken: setToken, unsetToken: unsetToken }}>
            <Layout />
          </userContext.Provider>
          }>
          <Route index element={<Home />} />
          <Route path=":category" element={<Posts token={tokenRef.current}/>} />
          <Route path=":category/:slug" element={<Post token={tokenRef.current} />} />
          <Route path="about-us" element={<About />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="community" element={<Community />} />
          <Route path="search" element={<Search />} />
          <Route path="login" element={tokenRef.current ? <Navigate to={`/profile?q=${tokenRef.current?.name.replace(" ",".")}`} /> : <Login setToken={setToken}/>} />
          <Route path="register" element={tokenRef.current ? <Navigate to={`/profile?q=${tokenRef.current?.name.replace(" ",".")}`} /> : <Register />} />
          <Route path="profile" element={!tokenRef.current ? <Navigate to="/login" /> : <Profile token={tokenRef.current} setToken={setToken} />} />
          <Route path="write-post" element={<WritePost token={tokenRef.current}/>} />
          <Route path="*" element={<Error status="404" document="Page"/>} />
        </Route>
        <Route exact path="/administrator"
          element={<userContext.Provider value={{token: tokenRef.current, setToken: setToken, unsetToken: unsetToken }}>
            {tokenRef.current ? (!tokenRef.current?.isAdmin ? <Navigate to={`../profile?=${tokenRef.current?.name.split(" ").join(".")}`} /> : <Administrator />): <Navigate to="../login" />}
            </userContext.Provider>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users token={tokenRef.current} />} />
          <Route path="posts" element={<PostsBackend />} />
          <Route path="comments" element={<Comments />} />
          <Route path="newpost" element={<Postform token={tokenRef.current} bgclass = "bg-light"/>} />
          <Route path="*" element={<Error status="404" document="Page"/>} />
        </Route>
      </>
    )
  )

  return (
    <>
      <RouterProvider router={router} >
        <ScrollRestoration getKey={(location, matches) => {
            return location.pathname;
        }}/>
      </RouterProvider>
    </>
  )
};


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <StrictMode>
      <Afriscope />
  </StrictMode>
);