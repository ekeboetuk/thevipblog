import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import Header from './components/header';
import Slider from './components/slider';
import Postcard from './components/postcard';
import Footer from './components/footer';
import Copyright from './components/copyright'

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/posts')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch posts', error);
      });
  }, []);

  return (
    <div>
      <Header sticky="top"/>
      <Slider />
      <div>
        <div className="container-md mx-auto py-5">
          <h2 className="text-center">FEATURED POSTS</h2>
          <Router>
    `       <Routes>
              <Route exact path="/">
                {posts.map((post) => (
                  <div key={post.id}>
                    <Postcard
                      image={post.image}
                      title={post.title}
                      content={post.content}
                      category={post.category}
                    />
                  </div>
                ))}
              </Route>
            </Routes>
          </Router>
        </div>
      </div>
      <Footer />
      <Copyright />
    </div>
  );
};

export default App;
