import './NavBarNew.scss';

import logo from '../../assets/images/Kanji.png';
import ncsu_logo from '../../assets/images/ncsu_logo copy.png';
import ig from '../../assets/images/ig.png';
import fb from '../../assets/images/fb.svg';
import lt from '../../assets/images/lt.png';
import yt from '../../assets/images/yt.png';
import SideBar from '../sidebar/SideBar';

function NavBarNew() {
  return (
    <div className="navbar">
      <SideBar />
      <div className="wrapper">
        <span className="logo-group">
          <a href="/"><img src={logo} alt="Logo" className="logo-image" /></a>
          <a href="https://getinvolved.ncsu.edu/organization/ncsulphie" target="_blank" rel="noopener noreferrer">
            <img src={ncsu_logo} alt="Logo" className="logo-image2" />
          </a>
        </span>
        <div className="social">
          <a href="https://www.instagram.com/ncsulphie/?hl=en">
            <img src={ig} alt="Instagram" />
          </a>
          <a href="https://www.facebook.com/ncsulphie/">
            <img src={fb} alt="Facebook" />
          </a>
          <a href="https://linktr.ee/ncsulphie">
            <img src={lt} alt="LinkTree" />
          </a>
          <a href="https://www.youtube.com/channel/UCdN-u9m3GSl0mMDvc24aGkg">
            <img src={yt} alt="YouTube" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default NavBarNew;
