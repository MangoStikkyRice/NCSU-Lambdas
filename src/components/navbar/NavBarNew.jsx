import './NavBarNew.scss'
import {motion} from "framer-motion"

import ig from '../../assets/images/ig.png'
import SideBar from '../sidebar/SideBar';

function NavBarNew() {
    return (
        <div className="navbar">
            <SideBar />
            <div className='wrapper'>
                <motion.span initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{duration: 0.5}}>LPHIE</motion.span>
                <div className='social'>
                    <a href="#"><img src={ig} alt /></a>
                    <a href="#"><img src={ig} alt /></a>
                    <a href="#"><img src={ig} alt /></a>
                    <a href="#"><img src={ig} alt /></a>
                </div>
            </div>
        </div>
    )
}

export default NavBarNew;