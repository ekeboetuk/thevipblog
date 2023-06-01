import { Link } from 'react-router-dom';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

function Footer() {
  return (
    <div className="bg-secondary py-5 text-light">
			<MDBRow className="container-md mx-auto">
				<MDBCol md='6' className='pe-5'>
					<img src="/assets/logo-white.png" width="140" height="40" className="d-inline-block align-top mb-3" alt="Afriscope Logo"
					/>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis...
					</p>
					<div className="d-flex justify-content-left align-items-center mb-4 mb-md-0">
						<a className="text-light" href="https://f.me/afriscope">
							<i className="fab fa-facebook-f fa-lg pe-5"></i>
						</a>
						<a className="text-light" href="https://t.me/afriscope">
							<i className="fab fa-twitter fa-lg pe-5"></i>
						</a>
						<a className="text-light" href="https://i.me/afriscope">
							<i className="fab fa-instagram fa-lg pe-5"></i>
						</a>
						<a className="text-light" href="https://yt.me/afriscope">
							<i className="fab fa-youtube fa-lg pe-4"></i>
						</a>
					</div>
				</MDBCol>
				<MDBCol md='3' className="mb-4 mb-md-0">
					<h5>Navigation</h5>
					<div className="d-flex flex-column">
						<Link className="text-white pb-3" to="/contact">Contact</Link>
						<Link className="text-white pb-3" to="/faq">FAQ</Link>
						<Link className="text-white pb-3" to="/about">About</Link>
					</div>
				</MDBCol>
				<MDBCol md='3'>
					<h5>Subscribe</h5>
					<p>Subscribe to our newsletter. Be always in trend!</p>
					<form className="input-group align-items-center">
						<div className="input-group-addon border border-light border-end-0">
							<i className="fas fa-envelope-circle-check fa-lg m-3"></i>
						</div>
						<input type="email" id="newsletter" className="form-control ps-0 border-light border-start-0" placeholder="E-mail"/>
					</form>
				</MDBCol>
			</MDBRow>
    </div>
  );
}

export default Footer;