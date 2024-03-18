import React, { StrictMode, createContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles.css";


import Layout from "./pages/layout";
import Home from "./pages/home";
import Posts from "./pages/posts";
import Post from "./pages/post";
import About from "./pages/about";
import Contact from "./pages/contact";
import NewPost from "./pages/newpost";
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

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route exact path="/" element={
          <userContext.Provider value={{token: token, unsetToken: unsetToken }}>
            <Layout />
          </userContext.Provider>
        }>
          <Route index element={<Home />} />
          <Route path=":path" element={<Posts />} />
          <Route path=":path/:slug" element={<Post token={token} />} />
          <Route path="about-us" element={<About />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="login" element={token ? <Navigate to={`/profile?q=${token?.name.replace(" ",".")}`} /> : <Login setToken = {setToken} />} />
          <Route path="register" element={token ? <Navigate to={`/profile?q=${token?.name.replace(" ",".")}`} /> : <Register />} />
          <Route path="profile" element={!token ? <Navigate to="/login" /> : <Profile token={token} />} />
          <Route path="newpost" element={<NewPost token={token}/>} />
          <Route path="*" element={<Error status="404" document="Page"/>} />
        </Route>

        <Route exact path="/administrator" element={
          <userContext.Provider value={{token: token, unsetToken: unsetToken }}>
          {token ? (!token?.isAdmin ? <Navigate to={`../profile?=${token?.name.split(" ").join(".")}`} /> : <Administrator />): <Navigate to="../login" />}
          </userContext.Provider>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="posts" element={<PostsBackend />} />
          <Route path="comments" element={<Comments />} />
          <Route path="newpost" element={<Postform token={token} bgclass = "bg-light"/>} />
          <Route path="*" element={<Error status="404" document="Page"/>} />
        </Route>
      </>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
};


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <StrictMode>
      <Afriscope />
  </StrictMode>
);