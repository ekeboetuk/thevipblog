import Navbar from './navbar';
import Social from './social';

function Header( ) {
  return (
    <div className="sticky-top">
        <Navbar />
        <Social />
    </div>
  );
}

export default Header;