import { useState, useRef } from 'react';

import axios from 'axios';

import tinymce from 'tinymce'
import { Editor } from '@tinymce/tinymce-react';

import '../styles.css'

export const Postform = ( {token} ) => {
    document.title = "Afriscope Administrator - Create Post"

    const initialstate = {
        title: "",
        metaDescription: "",
        featured: false,
        approved: false,
        featuredImage: null,
        category: "uncategorized",
        introText: "",
        tags: "",
        textarea: ""
    }
    const [sending, setSending] = useState(false);
    const [post, setPost] = useState(initialstate);

    const imageRef = useRef(null)

    const convertImage = (e) => {
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            setPost({...post, featuredImage: reader.result})
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const main = document.getElementsByTagName('main')[0]
        if(main.firstElementChild.nodeName === 'SPAN') {
            main.removeChild(main.firstElementChild)
        }
        setSending(true)

        await axios
        .post(process.env.REACT_APP_SERVER_URL + '/writepost', {
                image: post.featuredImage,
                title: post.title,
                metaDescription: post.metaDescription,
                intro: post.introText,
                tags: post.tags,
                body: post.textarea,
                category: post.category,
                featured: post.featured,
                approved: post.approved,
                author: token?.id
            }, {
                headers: {
                "Content-Type": "application/json",
            }
        })
        .then(()=>{
            window.scrollTo(0,0)
            setSending(false)
            imageRef.current.value = ""
            main.insertAdjacentHTML('afterbegin', '<small class="d-flex alert alert-success text-center align-items-center" id="alert" role="alert"><i class="fa-regular fa-circle-check pe-2"></i>Post successfully sent, thank you! Kindly wait for moderation before publishing</small>')
            setPost(initialstate);
            setTimeout(()=>{
                main.firstElementChild.remove()
            },8000)
        })
        .catch((error) => {
            window.scrollTo(0,0)
            setSending(false)
            main.insertAdjacentHTML('afterbegin', `<small class="d-flex alert alert-danger text-center align-items-center" id="alert" role="alert"><i class="fa-solid fa-triangle-exclamation pe-2"></i>Post Failed <i>(${error.message})</i>. Please try again!</small>`)
            setTimeout(()=>{
                main.firstElementChild.remove()
            },8000)
        })
    }

    return (
        <main className="flex-fill px-2">
            <form id="postform" onSubmit={handleSubmit} className={`row py-3 fw-normal justify-content-between align-items-center`}>
                <div className="col-12 col-md-6 d-block mb-3">
                    <label htmlFor="title" className="pe-2 fw-bold">Subject</label>
                    <input type="text" className="p-2 w-100" id="title" name="title" minLength={20} maxLength={100} value={post.title} onChange={(e) => setPost({...post, title: e.target.value})} placeholder="Post Subject" disabled={sending} required />
                    <small className="fs-8">Not less than 20 or more than 100 characters</small>
                </div>
                <div className="col-12 col-md-5 ms-md-2 d-block mb-3 justify-content-end align-self-start">
                    <label htmlFor="category" className="pe-2 fw-bold">Category</label>
                    <select className="w-100 px-2 bg-white" id="category" name="category" value={post.category} onChange={(e) => setPost({...post, category: e.target.value})} disabled={sending} required>
                        <option value="" disabled>Choose a Category</option>
                        <option value="uncategorized">Uncategorized</option>
                        <option value="lifestyles">Lifestyles</option>
                        <option value="sports">Sports</option>
                        <option value="fashion">Fashion</option>
                        <option value="technology">Technology</option>
                    </select>
                </div>
                <div className="mb-3 d-block">
                    <label htmlFor="metadescription" className="pe-2 fw-bold">Meta Desciption</label>
                    <textarea
                        id="metadescription"
                        className="w-100 p-2"
                        rows={2}
                        minLength={40}
                        maxLength={150}
                        value={post.metaDescription}
                        onChange={(e)=>setPost({...post, metaDescription: e.target.value})}
                        placeholder="Meta description"
                    />
                    <small className="fs-8">Meta description of not less than 40 or more than 150 character ({150 - post.metaDescription.length} remaining)</small>
                </div>
                <div className="mb-3 d-block">
                    <label htmlFor="introtext" className="pe-2 fw-bold">Introduction</label>
                    <textarea
                        id="introtext"
                        className="w-100 p-2"
                        rows={5}
                        minLength={200}
                        maxLength={600}
                        value={post.introText}
                        onChange={(e)=>setPost({...post, introText: e.target.value})}
                        placeholder="The introduction of this blog post goes here. As described below, when the content hits 200 characters the field for the body will automatically be mounted."
                        required
                    />
                    <small className="fs-8">Not less than 200 or more than 600 characters ({600 - post.introText.length} remaining)</small>
                </div>
                <div className="mb-3 d-block">
                    <input type="text" name="tags" className="w-100 px-2" value={post.tags} onChange={(e)=>setPost({...post, tags: e.target.value})} placeholder="Tags" required/>
                    <small className="fs-8">Enter tags for post, comma seperated if multiple</small>
                </div>
                {post.introText.length >= 200 &&
                    <>
                        <label htmlFor="content" className="pe-2 fw-bold">Content (WYSIWYG)</label>
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
                            body_id : 'content',
                            browser_spellcheck : true,

                            plugins: 'code image link lists',
                            toolbar: 'undo redo | fontfamily fontsize lineheight | bullist numlist | bold italic underline forecolor backcolor | link image code hr | alignleft aligncenter alignright alignjustify indent outdent',
                            font_family_formats:"Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Montserrat=montserrat; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva",
                            font_size_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
                            indentation: '20pt',

                            images_file_types: 'jpg,png,webp',
                            file_picker_types: 'image ',

                            content_css: 'default',

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
                        }}

                        id="post"
                        className="d-flex flex-column col-12 mb-3 overflow-auto"
                        disabled={sending}
                    />
                </>}
                <input type="file" id="featuredImage" name="featuredImage" ref={imageRef} size="60" className="col-12 col-md-6 px-0 mb-4" onChange={convertImage} required/>
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

export const Contact = () => {
    const [names, setNames] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState()
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [subscribe, setSubscribe] = useState(true)
    const [sending, setSending]= useState(false)

    async function handleSubmit(e) {
        e.preventDefault();
        setSending(true);
        await new Promise((resolve, reject) => {
            setTimeout(()=>{
                if(names.split(' ').length > 1) {
                    resolve(`Thank you ${names.split(' ')[0]}, your form has been submitted successful`);
                }
                reject ('Submission unsuccessful, please check the details and try again.')
            }, 3000)
        })
        .then((success) => {
            window.alert(success)
            setNames('');
            setEmail('');
            setMobile('');
            setSubject('');
            setMessage('');
            setSending(false);
        })
        .catch((failure) => {
            window.alert(failure)
            setSending(false);
        })
    }

    return (
        <form onSubmit={handleSubmit} className="row flex-wrap gap-4 justify-content-between">
            <input type="text" name="names" id="names" className="col-12" value={names} onChange={(e)=>setNames(e.target.value)} placeholder="Full Name*" required />
            <input type="email" name="email" id="email" className="col-7" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="E-mail Address*" required />
            <input type="phone" name="mobile" id="mobile" className="col-4" value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile Phone*" required />
            <input type="text" name="subject" id="subject" className="col-12" value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject*" required />
            <textarea name="message" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Kindly type in the details of your request here*" required/>
            <div className="d-flex align-items-center">
                <input type="checkbox" id="subscribe" name="subscribe" checked={subscribe} onChange={(e)=>setSubscribe(e.target.checked)}/>
                <label htmlFor="subscribe" className="ps-2">Subscribe to our periodic newsletter?</label>
            </div>
            <button type="submit" className="btn-primary" disabled={sending}>{sending?<><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait</>:"Submit"}</button>
        </form>
    )
}

export const Subscription = () => {
    const [names, setNames] = useState('')
    const [email, setEmail] = useState('')
    const [sending, setSending]= useState(false)

    async function handleSubscribe(e) {
        e.preventDefault();
        setSending(true);
        await new Promise((resolve, reject) => {
            setTimeout(()=>{
                if(names.split(' ').length > 1) {
                    resolve(`Thank you ${names.split(' ')[0]}, your subscription was successful`);
                }
                reject ('Subscription unsuccessful, please check the details and try again.')
            }, 3000)
        })
        .then((success) => {
            window.alert(success)
            setNames('');
            setEmail('');
            setSending(false);
        })
        .catch((failure) => {
            window.alert(failure)
            setSending(false);
        })
    }

    return (
        <form onSubmit={handleSubscribe} className="d-flex flex-column">
            <input type="text" name="fullname" className="p-2" value={names} onChange={(e)=>setNames(e.target.value)} placeholder="Full Name *" required />
            <i className="mb-3 fs-6">At Least Two Names</i>
            <input type="email" name="email" className="p-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email Address *" required/>
            <i className="mb-3 fs-6">* Required</i>
            <button type="submit" className="btn-primary flex-fill border-0 text-white p-2" disabled={sending}>Subscribe <i className={`${sending?'fa-regular fa-paper-plane fa-beat-fade':'fa-regular fa-paper-plane'}`}></i></button>
        </form>
    )
}