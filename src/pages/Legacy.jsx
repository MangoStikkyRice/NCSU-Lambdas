import './Legacy.scss'
import NavBarNew from '../components/navbar/NavBarNew'
import LegacyHero from '../components/legacy/LegacyHero'
import Parallax from '../components/legacy/Parallax'

function Legacy() {

    return <div>
        <section id="Top">
            <NavBarNew />
            <LegacyHero />
        </section>

        <section id="Services"><Parallax type="services"/></section>

        <section>Services</section>

        <section id="Portfolio"><Parallax type="portfolio"/></section>

        <section>Portfolio1</section>

        <section>Portfolio2</section>

        <section>Portfolio3</section>

        <section id="Contact">Contact</section>
    </div>
}

export default Legacy;