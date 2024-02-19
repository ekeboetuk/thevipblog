import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div id="footer" className="bg-secondary px-4 text-light">
			<div className="row container-fluid mx-auto px-5">
				<div className='d-flex flex-column col-12 col-md-5 pe-0 pe-md-5'>
					<img src="/assets/logo-white.png" width="140" height="40" className="d-block align-top mb-3" alt="Afriscope Logo"
					/>
					<span style={{textAlign: "left"}} className="d-block mb-3 pe-0 pe-md-5">
						Started as a bootcamp project for a set of aspiring developers and culminated into a full-fletched web application still under development to serve as a general purpose blog where you can get all kinds of information.
						Here to excite your interest as well as keep you informed, engaged and involved as you are welcomed to sign up to interact in the comment sections or write us a note to contribute as an Editor.
					</span>
				</div>
				<div className="col-12 col-md-2 mb-5 mb-md-0">
					<h5 className="mb-3">Gallery</h5>
				</div>
				<div className="col-12 col-md-2 mb-5 mb-md-0">
					<h5 className="mb-3 ">Navigation</h5>
					<div className="d-flex flex-column">
						<div className="d-flex flex-row align-items-center pb-2">
							<i className="fas fa-arrow-right px-1"></i>
							<Link className="text-white" to="/contact">Home Page</Link>
						</div>
						<div className="d-flex flex-row align-items-center pb-2">
							<i className="fas fa-arrow-right px-1"></i>
						<Link className="text-white" to="/faq">Frequently Asked Questions</Link>
						</div>
						<div className="d-flex flex-row align-items-center pb-2">
							<i className="fas fa-arrow-right px-1"></i>
							<Link className="text-white" to="/#">What We Do</Link>
						</div>
						<div className="d-flex flex-row align-items-center pb-2">
							<i className="fas fa-arrow-right px-1"></i>
						<Link className="text-white" to="/about">About Us</Link>
						</div>
						<div className="d-flex flex-row align-items-center pb-2">
							<i className="fas fa-arrow-right px-1"></i>
							<Link className="text-white" to="/contact">Contact Us</Link>
						</div>
					</div>
				</div>
				<div className ="col-12 col-md-3">
					<h5 className="">Subscribe</h5>
					<span className="">Subscribe to our newsletter. Be always in trend!</span>
					<form className="d-flex position-relative my-4">
						<input type="email" id="newsletter" className="flex-fill ps-5 border-0 pt-1" placeholder="E-mail"/>
						<i className="fas fa-envelope-circle-check fa-lg text-dark position-absolute top-50 start-0 translate-middle ps-5 lh-1"></i>
					</form>

					<h5 className="mt-4 mb-3">Social Media</h5>
					<div className="d-flex justify-content-left align-items-center mb-5 mb-md-0">
						<a className="text-light" href="https://f.me/afriscope">
							<i className="fa-brands fa-facebook fa-lg pe-5 fs-4"></i>
						</a>
						<a className="text-light" href="https://t.me/afriscope">
							<i className="fa-brands fa-twitter fa-lg pe-5 fs-4"></i>
						</a>
						<a className="text-light" href="https://i.me/afriscope">
							<i className="fa-brands fa-instagram fa-lg pe-5 fs-4"></i>
						</a>
						<a className="text-light" href="https://yt.me/afriscope">
							<i className="fa-brands fa-youtube fa-lg pe-4 fs-4"></i>
						</a>
					</div>
				</div>
			</div>
    </div>
  );
}

export default Footer;