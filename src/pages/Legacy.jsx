import './Legacy.scss'
import NavBarNew from '../components/navbar/NavBarNew'
import LegacyHero from '../components/legacy/LegacyHero'
import Parallax from '../components/legacy/Parallax'
import Philanthropy from '../components/legacy/Philanthropy'
import Info from '../components/legacy/Info'

function Legacy() {
    return (
        <div className='example-page'>
            <section id="Top" className="full-height">
                <NavBarNew />
                <LegacyHero />
            </section>

            <section id="Contact" className="full-height">
                <Info />
            </section>

            <section id="Philanthropy" className="fuck">
                <Philanthropy />
            </section>

            <section id="Services" className="full-height">
                <Parallax type="services" />
            </section>
        </div>
    );
}

export default Legacy;