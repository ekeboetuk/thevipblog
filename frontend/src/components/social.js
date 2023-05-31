import { MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit'
import fb from '../images/fb-icon.png';
import tt from '../images/tt-icon.png';
import ig from '../images/ig-icon.png';
import yt from '../images/yt-icon.png';
import '../styles.css';

function Social() {
  return (
    <div className="bg-primary py-3 text-light">
			<MDBRow className="container-md mx-auto">
				<MDBCol size='0' lg='4' className='m-auto'>
				</MDBCol>
				<MDBCol size='6' lg='4' className='d-flex justify-content-start justify-content-lg-center align-items-center'>
					<img src={fb} width="10" height="20" className="me-lg-5 me-3" alt="Facebook Logo"/>
					<img src={tt} width="20" height="20" className="me-lg-5 me-3" alt="Twitter Logo"/>
					<img src={ig} width="20" height="20" className="me-lg-5 me-3" alt="Instagram Logo"/>
					<img src={yt} width="30" height="20" alt="Youtube Logo"/>
				</MDBCol>
				<MDBCol size='6' lg='4' className='d-flex justify-content-end justify-content-lg-end align-items-center'>
        <MDBBtn outline color="secondary" className='text-white px-2 px-md-3' type='button'>
          <a href="/sign-in" className="text-white">Sign in/ Sign up</a>
        </MDBBtn>
				</MDBCol>
      </MDBRow>
    </div>
  );
}

export default Social;