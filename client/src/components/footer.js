import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div id="footer" className="bg-secondary py-5 px-4 text-light">
			<div className="row container-md mx-auto">
				<div className='col-12 col-md-6 pe-5'>
					<img src="/assets/logo-white.png" width="140" height="40" className="d-inline-block align-top mb-3" alt="Afriscope Logo"
					/>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis...
					</p>
					<div className="d-flex justify-content-left align-items-center mb-4 mb-md-0">
						<a className="text-light" href="https://f.me/afriscope">
							<i className="fa-brands fa-facebook fa-lg pe-5"></i>
						</a>
						<a className="text-light" href="https://t.me/afriscope">
							<i className="fa-brands fa-twitter fa-lg pe-5"></i>
						</a>
						<a className="text-light" href="https://i.me/afriscope">
							<i className="fa-brands fa-instagram fa-lg pe-5"></i>
						</a>
						<a className="text-light" href="https://yt.me/afriscope">
							<i className="fa-brands fa-youtube fa-lg pe-4"></i>
						</a>
					</div>
				</div>
				<div className="col-12 col-md-3 mb-4 mb-md-0">
					<h5>Navigation</h5>
					<div className="d-flex flex-column">
						<Link className="text-white pb-3" to="/contact">Contact</Link>
						<Link className="text-white pb-3" to="/faq">FAQ</Link>
						<Link className="text-white pb-3" to="/about">About</Link>
					</div>
				</div>
				<div className ="col-12 col-md-3">
					<h5>Subscribe</h5>
					<p>Subscribe to our newsletter. Be always in trend!</p>
					<form className="d-flex position-relative">
						<input type="email" id="newsletter" className="flex-fill ps-5 border-0 pt-1" placeholder="E-mail"/>
						<i className="fas fa-envelope-circle-check fa-lg text-dark position-absolute top-50 start-0 translate-middle ps-5 lh-1"></i>
					</form>
				</div>
			</div>
    </div>
  );
}

export default Footer;