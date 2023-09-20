import { useState, useRef } from 'react';

import axios from 'axios';

import tinymce from 'tinymce'
import { Editor } from '@tinymce/tinymce-react';

function Postform ( {token} ) {
    const initialstate = {
        title: "",
        featured: false,
        approved: false,
        featuredImage: null,
        category: "uncategorized",
        introText: "",
        tags: "",
        textarea: ""
    }
    const [sending, setSending] = useState(false)
    const [post, setPost] = useState(initialstate);

    const imageRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const main = document.getElementsByTagName('main')[0]
        if(main.firstElementChild.nodeName === 'SPAN') {
            main.removeChild(main.firstElementChild)
        }

        const formData = new FormData();
        formData.append("image", post.featuredImage);
        formData.append("title", post.title);
        formData.append("intro", post.introText);
        formData.append("tags", post.tags);
        formData.append("body", post.textarea);
        formData.append("category", post.category);
        formData.append("featured", post.featured);
        formData.append("approved", post.approved);
        formData.append("author", token?.id)

        setSending(true)

        await axios
        .post("http://localhost:3001/post/newpost", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
        })
        .then(()=>{
            window.scrollTo(0,0)
            setSending(false)
            imageRef.current.value = ""
            main.insertAdjacentHTML('afterbegin', '<span class="d-flex alert alert-success text-center align-items-center" id="alert" role="alert"><i class="fa-regular fa-circle-check pe-2"></i>Post successfully sent, thank you! Kindly wait for moderation before publishing</span>')
            setPost(initialstate);
            setTimeout(()=>{
                main.firstElementChild.remove()
            },8000)
        })
        .catch((error) => {
            window.scrollTo(0,0)
            setSending(false)
            main.insertAdjacentHTML('afterbegin', `<span class="d-flex alert alert-danger text-center align-items-center" id="alert" role="alert"><i class="fa-solid fa-triangle-exclamation pe-2"></i>Post Failed <i>(${error.message})</i>. Please try again!</span>`)
        })
    }

    return (
        <main className="flex-fill px-2">
            <form id="postform" onSubmit={handleSubmit} className={`row py-3 mx-auto fs-6 fw-normal justify-content-between align-items-center`}>
                <div className="col-12 col-md-6 d-block mb-3">
                    <label htmlFor="title" className="pe-2 fs-7 fw-bold">Subject</label>
                    <input type="text" className="p-2 w-100" id="title" name="title" minLength={20} maxLength={100} value={post.title} onChange={(e) => setPost({...post, title: e.target.value})} placeholder="Post Subject" disabled={sending} required />
                    <small className="fs-8">Note less than 20 or more than 100 characters</small>
                </div>
                <div className="col-12 col-md-5 ms-md-2 d-block mb-3 justify-content-end align-self-start">
                    <label htmlFor="category" className="pe-2 fs-7 fw-bold">Category</label>
                    <select className="w-100 p-2 bg-white" id="category" name="category" value={post.category} onChange={(e) => setPost({...post, category: e.target.value})} disabled={sending} required>
                        <option value="" disabled>Choose a Category</option>
                        <option value="uncategorized">Uncategorized</option>
                        <option value="lifestyles">Lifestyles</option>
                        <option value="sports">Sports</option>
                        <option value="fashion">Fashion</option>
                        <option value="general">General Topics</option>
                    </select>
                </div>
                <div className="mb-3 d-block">
                    <label htmlFor="introtext" className="pe-2 fs-7 fw-bold">Introduction</label>
                    <textarea
                        id="introtext"
                        className="w-100 p-2"
                        rows={5}
                        minLength={200}
                        maxLength={300}
                        value={post.introText}
                        onChange={(e)=>setPost({...post, introText: e.target.value})}
                        placeholder="The introduction of this blog post goes here. As described below, when the content hits 200 characters the field for the body will automatically be mounted."
                        required
                    />
                    <small className="fs-8">Note less than 200 or more than 300 characters ({300 - post.introText.length} remaining)</small>
                </div>
                <div className="mb-3 d-block">
                    <input type="text" name="tags" className="w-100 px-2" value={post.tags} onChange={(e)=>setPost({...post, tags: e.target.value})} placeholder="Tags"/>
                    <small className="fs-8">Enter tags for post, comma seperated if multiple</small>
                </div>
                {post.introText.length >= 200 &&
                    <>
                        <label htmlFor="content" className="pe-2 fs-7 fw-bold">Content (WYSIWYG)</label>
                        <Editor
                        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                        onEditorChange={(content, editor) => setPost({...post, textarea:content})}
                        value={post.textarea}

                        init={{
                            promotion: false,
                            height: 500,
                            skin: 'oxide',
                            body_class: 'content',
                            menubar: false,
                            toolbar_sticky: true,
                            toolbar_sticky_offset: 50,
                            toolbar_mode: 'wrap',
                            body_id : "content",
                            browser_spellcheck : true,

                            plugins: 'code image link lists',
                            toolbar: 'undo redo | fontfamily fontsize blocks | bullist numlist | bold italic underline forecolor backcolor | link image code hr | alignleft aligncenter alignright alignjustify indent outdent',
                            font_family_formats: 'Ubuntu=ubuntu; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                            font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                            indentation: '20pt',

                            images_file_types: 'jpg,png',
                            file_picker_types: 'image ',

                            file_picker_callback: (cb, value, meta) => {
                            const input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.setAttribute('accept', 'image/*');

                            input.addEventListener('change', (e) => {
                            const file = e.target.files[0];

                            const reader = new FileReader();
                            reader.addEventListener('load', () => {
                                const id = 'blobid' + (new Date()).getTime();
                                const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                                const base64 = reader.result.split(',')[1];
                                const blobInfo = blobCache.create(id, file, base64);
                                blobCache.add(blobInfo);

                                cb(blobInfo.blobUri(), { title: file.name });
                            });
                                reader.readAsDataURL(file);
                                });

                                input.click();
                            },
                            block_unsupported_drop: true,
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}

                        id="post"
                        className="d-flex flex-column col-12 mb-3 overflow-auto"
                        disabled={sending}
                    />
                </>}
                <input type="file" id="featuredImage" name="featuredImage" ref={imageRef} size="60" className="col-12 col-md-6 px-0 mb-4" onChange={(e) => setPost({...post, featuredImage: e.target.files[0]})} required/>
                {token?.type==="Administrator" &&
                    <>
                        <label htmlFor="featured" className="d-flex col-6 col-md-3 align-items-center mb-4">
                            <input type="checkbox" className="col-1 me-2" id="featured" name="featured" checked={post.featured} onChange={(e) => setPost({...post, featured: !post.featured})} />
                            Featured
                        </label>
                        <label htmlFor="approved" className="d-flex col-6 col-md-3 align-items-center mb-4">
                            <input type="checkbox" className="col-1 me-2" id="approved" name="approved" checked={post.approved} onChange={(e) => setPost({...post, approved: !post.approved})} />
                            Published
                        </label>
                    </>
                }
                <button type="submit" id="submit" className="col-12 py-2 border-0 btn-primary text-white rounded" disabled={sending}>{sending?<i className="fa-solid fa-circle-notch fa-spin"></i>:"Post"}</button>
            </form>
        </main>
    )
}

export default Postform;