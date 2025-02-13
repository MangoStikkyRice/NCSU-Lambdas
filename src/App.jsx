import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Recruitment from './pages/Recruitment';
import Brothers from './pages/Brothers';
import Media from './pages/Media';
import LegacyChooser from './pages/LegacyChooser';

function App() {
  return (
    <Router>
      <div>
        {/* Sets a blue theme for iPhone islands. */}
        <meta name="theme-color" content="#203c79" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/legacy" element={<LegacyChooser />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/brothers" element={<Brothers />} />
          <Route path="/media" element={<Media />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
