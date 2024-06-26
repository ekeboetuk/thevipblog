import { Link } from "react-router-dom";

import { Subscription } from "./forms";

function Footer() {

    return (
        <footer className="container-fluid mx-auto bg-secondary text-white">
            <section className="row p-5">
                <div className="d-flex flex-column col-12 col-md-5 mb-5">
                    <Link to="/">
                        <img
                            src="/assets/logo-white.png"
                            width="140"
                            height="35"
                            className="d-block align-top mb-3"
                            alt="Afriscope Logo"
                        />
                    </Link>
                    <span
                        style={{ textAlign: "left" }}
                        className="d-block mb-3 pe-0 pe-md-5"
                    >
                        Started as a bootcamp project for a set of aspiring
                        developers and culminated into a full-fletched web
                        application still under development to serve as a
                        general purpose blog where you can get all kinds of
                        information. Here to excite your interest as well as
                        keep you informed, engaged and involved as you are
                        welcomed to sign up to interact in the comment sections
                        or write us a note to contribute as an Editor.
                    </span>
                </div>
                <div className="col-12 col-md-2 mb-5">
                    <h4 className="mb-5">Tweets</h4>
                    <h4 className="mb-5">We Are Social</h4>
                    <div className="">
                        <a className="text-light" href="https://f.me/afriscope">
                            <i className="fa-brands fa-square-facebook fa-lg pe-4"></i>
                        </a>
                        <a className="text-light" href="https://t.me/afriscope">
                            <i className="fa-brands fa-square-x-twitter fa-lg pe-4"></i>
                        </a>
                        <a className="text-light" href="https://i.me/afriscope">
                            <i className="fa-brands fa-square-instagram fa-lg pe-4"></i>
                        </a>
                    </div>
                </div>
                <div id="footernavigation" className="col-12 col-md-2 mb-5">
                    <h4 className="mb-4 ">Navigation</h4>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row align-items-center pb-2 notch-forward">
                            <i className="fas fa-circle-chevron-right pe-2"></i>
                            <Link className="text-white" to="/">
                                Home Page
                            </Link>
                        </div>
                        <div className="d-flex flex-row align-items-center pb-2 notch-forward">
                            <i className="fas fa-circle-chevron-right pe-2"></i>
                            <Link className="text-white" to="/#">
                                FAQs
                            </Link>
                        </div>
                        <div className="d-flex flex-row align-items-center pb-2 notch-forward">
                            <i className="fas fa-circle-chevron-right pe-2"></i>
                            <Link className="text-white" to="/#">
                                What We Do
                            </Link>
                        </div>
                        <div className="d-flex flex-row align-items-center pb-2 notch-forward">
                            <i className="fas fa-circle-chevron-right pe-2"></i>
                            <Link className="text-white" to="/about-us">
                                About Us
                            </Link>
                        </div>
                        <div className="d-flex flex-row align-items-center pb-2 notch-forward">
                            <i className="fa-solid fa-circle-chevron-right pe-2"></i>
                            <Link className="text-white" to="/contact-us">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <h4 className="mb-4">Subscribe</h4>
                    <p className="">
                        Subscribe to our newsletter. Be always in trend!
                    </p>
                    <Subscription />
                </div>
            </section>
            <div id="copyright" className="bg-secondary square border-top border-primary p-2 text-light text-center">
                <small className="fw-normal">
                    Copyright © 2023 Africope | MOC Inc | All Rights Reserved.
                </small>
            </div>
        </footer>
    );
}

export default Footer;
