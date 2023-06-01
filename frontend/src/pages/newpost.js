import React from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function NewPost() {
    const [post, setPost] = React.useState({
        title: '',
        isFeatured: false,
        featuredImage: '',
        content: ''
    });

    const modules = {
        toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: [] }],
        [{ font: [] }],
        [{ align: ["right", "center", "justify"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ color: ["red", "#785412"] }],
        [{ background: ["red", "#785412"] }]
        ]
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "color",
        "image",
        "background",
        "align",
        "size",
        "font"
    ];

    const userToken = JSON.parse(localStorage.getItem("token"))

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("image", post.featuredImage);
        formData.append("title", post.title);
        formData.append("body", post.content);
        formData.append("category", post.category);
        formData.append("featured", post.isFeatured);
        formData.append("author", userToken?.id)

        await axios
        .post("http://localhost:3001/post/newpost", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
        })
        .then(()=>{
          setPost({
                title: '',
                isFeatured: false,
                featuredImage: null,
                category: '',
                message: 'Post Successful',
                content: null
            });

            document.getElementById('posttitle').style.fontColor = "green"
            window.scrollTo(0,0)
        })
        .catch((error) => {
            document.getElementById('posttitle').innerHTML = "Post Failed"
            document.getElementById('posttitle').style.fontColor = "red"
            window.scrollTo(0,0)
        })

        document.getElementById("postform").innerHTML = "Please Wait!!!"
    }

    return (
            userToken ?
            <>
                <div className="container-fluid mx-auto text-center fw-bold fs-5 py-4 bg-tertiary">
                    <img src="/assets/icon.png" alt="afriscope icon" className="py-2" />
                    <p>NEW POST</p>
                </div>
                <div className="container-sm py-5">
                    <h6 className="text-center pb-2 text-success fst-italic" id="posttitle">{post.title || post.message}</h6>
                    <form id="postform" onSubmit={handleSubmit} className="row mx-auto fs-6 fw-normal justify-content-between align-items-center bg-tertiary border-primary px-3 px-md-5 py-4 rounded-5" style={{width: "100%", maxWidth: "960px"}}>
                    <div className="col-12 col-md-7 d-flex flex-column mb-3">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="px-3 py-1 fst-italic" id="title" name="title" value={post.title} onChange={(e) => setPost({...post, title: e.target.value, message: ''})} placeholder="Post Title" required />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column mb-3">
                    <label htmlFor="category">Category</label>
                    <select className="px-3 py-1 rounded-0 fst-italic" id="category" name="category" value={post.category} onChange={(e) => setPost({...post, category: e.target.value})}>
                            <option value="uncategorized">Uncategorized</option>
                            <option value="sports">Sports</option>
                            <option value="lifestyles">Lifestyles</option>
                            <option value="fashion">Fashion</option>
                        </select>
                    </div>
                    <ReactQuill modules={modules} formats={formats} theme="snow" className="col-12 mb-3 overflow-auto" value={post.content} onChange={(content) => setPost({...post, content:content})} />
                    <div className="d-flex justify-content-start mb-3 col-12 col-md-3 px-0">
                        <input type="checkbox" className="col-1 me-2" id="isFeatured" name="isFeatured" checked={post.isFeatured} onChange={(e) => setPost({...post, isFeatured: !post.isFeatured})} />
                        <label htmlFor="isFeatured" className="col-4">Featured?</label>
                    </div>
                    <input type="file" id="featuredImage" name="featuredImage" className="col-12 col-md-5 mb-3 px-0" onChange={(e) => setPost({...post, featuredImage: e.target.files[0]})} />
                    <div className="col-12 col-md-4 mb-3">Author: {userToken?.name}</div>
                    <button type="submit" id="submit" className="py-3 border-0 btn-primary w-100 text-center text-white text-uppercase">Submit Post</button>
                    </form>
                </div>
            </>:
            <div className="container-md text-center my-5 py-5">
                <h1 className="fs-1 fw-semibold text-brand">403</h1>
                <h5 className="fw-semibold">Access Denied</h5>
                <p>Page is restricted to registered users only. Please sign in to continue</p>
                <Link className="text-white btn-primary rounded-9 px-3 pt-2 pb-1 fw-semibold" to="/signin" type="button"><i className="fas fa-user-lock pe-2"></i>Sign In</Link>
            </div>
    )
}

export default NewPost;