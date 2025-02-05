// Legacy.jsx
import './Legacy.scss';
import NavBarNew from '../components/navbar/NavBarNew';
import LegacyHero from '../components/legacy/LegacyHero';
import Philanthropy from '../components/legacy/Philanthropy';
import Info from '../components/legacy/Info';
import Constitution from '../components/legacy/Constitution';

function Legacy() {
  return (
    <div className="legacy-page">
      <NavBarNew />
      <LegacyHero />

      <section id="Contact">
        <Info />
      </section>

      <section id="Philanthropy">
        <Philanthropy />
      </section>

      <section id="Constitution">
        <Constitution />
      </section>
    </div>
  );
}

export default Legacy;
