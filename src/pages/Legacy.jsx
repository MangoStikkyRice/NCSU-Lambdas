// Legacy.jsx
import './Legacy.scss';
import NavBarNew from '../components/navbar/NavBarNew';
import LegacyHero from '../components/legacy/LegacyHero';
import Philanthropy from '../components/legacy/Philanthropy';
import Info from '../components/legacy/Info';
import '../App.css';

function Legacy() {
  return (
    // Snap container for the entire page
    <div className="snap-container">
      <section id="Top">
        <NavBarNew />
        <LegacyHero />
      </section>

      <section id="Contact">
        <Info />
      </section>

      <section id="Philanthropy">
        <Philanthropy />
      </section>
    </div>
  );
}

export default Legacy;
