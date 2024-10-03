import './Legacy.scss'
import NavBarNew from '../components/navbar/NavBarNew'
import LegacyHero from '../components/legacy/LegacyHero'
import Parallax from '../components/legacy/Parallax'
import Philanthropy from '../components/legacy/Philanthropy'

function Legacy() {

    return <div>
        <section id="Top">
            <NavBarNew />
            <LegacyHero />
        </section>

        <section id="Services"><Parallax type="services"/></section>

        <section>Services</section>

        <section id="Portfolio"><Parallax type="portfolio"/></section>

        <Philanthropy />

        <section id="Contact">Contact</section>
    </div>
}

export default Legacy;