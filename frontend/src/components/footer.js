import { MDBRow, MDBCol } from 'mdb-react-ui-kit'
import logo from '../images/logo-white.png';
import fb from '../images/fb-icon.png';
import tt from '../images/tt-icon.png';
import ig from '../images/ig-icon.png';
import yt from '../images/yt-icon.png';
import '../styles.css';

function Footer() {
  return (
    <div className="bg-secondary py-5 text-light">
			<MDBRow className="container-md mx-auto">
				<MDBCol md='6' className='pe-5'>
					<img src={logo} width="140" height="40" className="d-inline-block align-top mb-3" alt="Afriscope Logo"
					/>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis...
					</p>
					<div className="d-flex justify-content-left align-items-center mb-4 mb-md-0">
						<img src={fb} width="10" height="20" className="me-4" alt="Facebook Icon" />
						<img src={tt} width="20" height="20" className="me-4" alt="Twitter Icon" />
						<img src={ig} width="20" height="20" className="me-4" alt="Instagram Icon" />
						<img src={yt} width="30" height="20" className="me-4" alt="Youtube Icon" />
					</div>
				</MDBCol>
				<MDBCol md='2' className="mb-4 mb-md-0">
					<h4>Navigation</h4>
					<p>Contact</p>
					<p>FAQ</p>
					<p>About</p>
				</MDBCol>
				<MDBCol md='4'>
					<h4>Subscribe</h4>
					<p>Subscribe to our newsletter. Be always in trend!</p>
					<div className="form-outline form-white">
						<i className="fas fa-email trailing"></i>
						<input type="email" id="newsletter" class="form-control form-icon-trailing" />
						<label class="form-label" for="newsletter">E-mail</label>
					</div>
				</MDBCol>
			</MDBRow>
    </div>
  );
}

export default Footer;