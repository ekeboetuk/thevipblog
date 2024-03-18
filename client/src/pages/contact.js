import React, { useEffect } from 'react';

import { Contact } from '../components/forms'
import { GoogleMap } from '../components/maps';

function ContactUs() {
    useEffect(()=>{
        document.title = "Afriscope Blog - Contact Us"
    })

    return (
        <>
            <section className="container-md">
                <div className="row row-col-1 row-col-md-2 gy-5">
                    <div className="col-12 col-md-6 pe-0 pe-md-5 fs-3">
                        <p className="col">Write to us about anything starting from request to join our editors team to features suggest, design review, business relation, you can go on. We promise to give you a feedback in the shortest time.<br/>Thank you!</p>
                        <div className="d-flex flex-row flex-wrap gap-4">
                            <span><i className="fa-solid fa-globe pe-2 text-brand"></i>afriscope.ng</span>
                            <span><i className="fa-solid fa-envelope pe-2 text-brand"></i>info@afriscope.ng</span>
                            <span><i className="fa-solid fa-phone pe-2 text-brand"></i>+234-**********</span>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 p-3
                    p-md-5 bg-tertiary">
                        <Contact />
                    </div>
                </div>
            </section>
            <div className="container-fluid">
                <GoogleMap />
            </div>
        </>
    )
}

export default ContactUs