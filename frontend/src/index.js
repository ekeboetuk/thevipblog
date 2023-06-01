import React, { useState, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './styles.css';

import Layout from "./pages/layout";
import Home from "./pages/home";
import Posts from "./pages/posts";
import Post from "./pages/post";
import About from "./pages/about";
import Contact from "./pages/contact";
import NewPost from "./pages/newpost";
import Error from "./pages/error";
import Administrator from "./pages/administrator";
import { Signin, Signup, Profile, useToken } from "./components/user";


export const userContext = createContext()

function Afriscope() {
  const {token, setToken, unsetToken} = useToken();
	const [user] = useState(()=>JSON.parse(token));

   return (
       <Routes>
         <Route exact path="/" element={
          <userContext.Provider value={{user: user, token: token, unsetToken: unsetToken }}>
            <Layout />
          </userContext.Provider>
          }>
           <Route index element={<Home />} />
           <Route path="/posts/:name" element={<Posts />} />
           <Route path="/post/:id" element={<Post />} />
           <Route path="/about" element={<About />} />
           <Route path="/contact" element={<Contact />} />
           <Route path="/signin" element={token ? <Navigate replace to="/profile" /> : <Signin setToken = {setToken} />} />
           <Route path="/signup" element={token ? <Navigate replace to="/profile" /> : <Signup />} />
           <Route path="/profile" element={!token ? <Navigate replace to="/signin" /> : <Profile />} />
           <Route path="/newpost" element={<NewPost />} />
           <Route path="*" element={<Error />} />
         </Route>
         <Route exact path="/administrator" element={<Administrator />} />
       </Routes>
   );
 };


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <Afriscope />
    </Router>
  </React.StrictMode>,
);